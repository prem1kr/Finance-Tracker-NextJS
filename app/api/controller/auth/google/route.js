import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../../../models/auth/userDB.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, password } = body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      if (!password) {
        return NextResponse.json(
          {
            status: "NEW_USER",
            message: "Please set a password to complete signup",
            email,
            name,
            googleId: sub,
          },
          { status: 200 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        googleId: sub,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        status: "SUCCESS",
        message: "Google login successful",
        user: { id: user._id, name: user.name, email: user.email },
        token: jwtToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google auth error:", error.message);
    return NextResponse.json(
      { message: "Google Authentication Failed" },
      { status: 500 }
    );
  }
}
