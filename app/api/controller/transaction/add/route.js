import connectDB from "../../../config/db.js";
import transactionModel from "../../../models/transaction/transactionDB.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { title, amount, type, date, icon } = await req.json();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    await connectDB();
    const addTransaction = await transactionModel.create({
      title,
      amount,
      date,
      icon,
      type,
      user: userId,
    });

    console.log("Transaction added successfully", addTransaction);
    return NextResponse.json({ message: "Transaction added successfully", data: addTransaction });
  } catch (error) {
    console.error("Error during transaction add process", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
