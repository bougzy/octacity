import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: "deposit" | "withdrawal" | "transfer" | "grant" | "donation";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  description: string;
  senderName: string;
  receiverName: string;
  transactionDate: Date | null;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["deposit", "withdrawal", "transfer", "grant", "donation"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
    description: { type: String, default: "" },
    senderName: { type: String, default: "" },
    receiverName: { type: String, default: "" },
    transactionDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
