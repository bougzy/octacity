

import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: "deposit" | "withdrawal" | "transfer" | "grant" | "donation";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "processing"; // Add "processing"
  description: string;
  senderName: string;
  receiverName: string;
  transactionDate: Date | null;
  createdAt: Date;
  // Transfer specific fields
  recipientFullName?: string;
  recipientBankName?: string;
  bankAddress?: string;
  routingNumber?: string;
  accountNumber?: string;
  accountType?: "checking" | "savings";
  recipientAddress?: string;
  referenceMemo?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["deposit", "withdrawal", "transfer", "grant", "donation"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "completed", "failed", "processing"], default: "completed" },
    description: { type: String, default: "" },
    senderName: { type: String, default: "" },
    receiverName: { type: String, default: "" },
    transactionDate: { type: Date, default: null },
    // New transfer fields
    recipientFullName: { type: String },
    recipientBankName: { type: String },
    bankAddress: { type: String },
    routingNumber: { type: String },
    accountNumber: { type: String },
    accountType: { type: String, enum: ["checking", "savings"] },
    recipientAddress: { type: String },
    referenceMemo: { type: String },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);