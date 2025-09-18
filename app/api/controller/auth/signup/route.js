import { NextResponse } from "next/server";
import userModel from "../../../models/auth/userDB.js";
import connectDB from "../../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req) {
  const { name, email, password } = await req.json();

  try {
    await connectDB();

    const emailNormalized = email.toLowerCase();
    const user = await userModel.findOne({ email: emailNormalized });
    if (user) {
      console.log(`User already registered: ${user.email}`);
      return NextResponse.json( { error: "User already registered, please login." },  { status: 409 });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const Signup = await userModel.create({
      name,
      email: emailNormalized,
      password: hashpassword,
    });

    const token = jwt.sign({ email: emailNormalized }, process.env.SECRET_KEY);
    const response = NextResponse.json({ success: "User created successfully" });
    response.cookies.set("token", token);
    console.log(`User created successfully: ${Signup}`);
    
    return response;
  } catch (error) {
    console.log("Error during signup", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
