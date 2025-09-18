// backend login API (POST)
import userModel from "../../../models/auth/userDB.js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../../../config/db.js";

dotenv.config();

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    await connectDB();

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "user not found, Signup first" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
    // Add userId in response for frontend
    const response = NextResponse.json({
      success: "user login successfully",
      userId: user._id.toString(),
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.log("Error during login process", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
