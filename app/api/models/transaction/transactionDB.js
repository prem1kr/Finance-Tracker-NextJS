import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String },
  date: { type: Date, required: true },
  note: { type: String },
  icon: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const transactionModel = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default transactionModel;
