import connectDB from "../../../config/db.js";
import transactionModel from "../../../models/transaction/transactionDB.js";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (!userId || !id) {
    return NextResponse.json({ error: "Missing userId or transaction id" }, { status: 400 });
  }

  try {
    await connectDB();

    const deleted = await transactionModel.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return NextResponse.json({ message: "Transaction not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
