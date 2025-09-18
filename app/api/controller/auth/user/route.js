import connectDB from "../../../config/db.js";
import userModel from "../../../models/auth/userDB.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    await connectDB();

    const user = await userModel.findById(userId).select("name email avatar premium");

    if (!user) {
      return NextResponse.json({ message: "User not found", data: null }, { status: 404 });
    }

    return NextResponse.json({
      message: "user fetched successfully",
      data: {
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        premium: user.premium || false,
      },
    });
  } catch (error) {
    console.log("Error during user data fetching", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
