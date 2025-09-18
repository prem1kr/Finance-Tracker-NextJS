import connectDB from "../../../config/db.js";
import transactionModel from "../../../models/transaction/transactionDB.js";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const { id, title, amount, type, date, icon } = await req.json();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId || !id) {
    return NextResponse.json({ error: "Missing userId or transaction id" }, { status: 400 });
  }

  try {
    await connectDB();

    const updatedTransaction = await transactionModel.findOneAndUpdate(
      { _id: id, user: userId },
      { title, amount, type, date, icon },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json({ message: "Transaction not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction updated successfully", data: updatedTransaction });
  } catch (error) {
    console.error("Error updating transaction:", error);
  }
}
