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

    if (!token) {
      return NextResponse.json(
        { status: "ERROR", message: "Google token missing" },
        { status: 400 }
      );
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    if (!email) {
      return NextResponse.json(
        { status: "ERROR", message: "Google did not return an email" },
        { status: 400 }
      );
    }

    let user = await userModel.findOne({ email });

    // Case 1: New user without password
    if (!user && !password) {
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

    // Case 2: New user completing signup with password
    if (!user && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        googleId: sub,
      });
    }

    // Case 3: Existing user logging in
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
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
    console.error("Google auth error:", error);
    return NextResponse.json(
      { status: "ERROR", message: "Google Authentication Failed" },
      { status: 500 }
    );
  }
}
