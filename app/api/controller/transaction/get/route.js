import connectDB from "../../../config/db.js";
import transactionModel from "../../../models/transaction/transactionDB.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const userId = searchParams.get("userId"); 

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
      await connectDB();

    const filter = { user: userId };
    if (type) filter.type = type;

    await connectDB();
    const transactions = await transactionModel.find(filter).sort({ date: -1 });
    return NextResponse.json({ data: transactions });
  } catch (error) {
    console.error("Error fetching transactions", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
