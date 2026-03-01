import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

// GET transactions
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let transactions;

    if (decoded.role === "admin") {
      if (userId) {
        transactions = await Transaction.find({ userId }).sort({ transactionDate: -1, createdAt: -1 });
      } else {
        transactions = await Transaction.find()
          .populate("userId", "fullName email")
          .sort({ transactionDate: -1, createdAt: -1 });
      }
    } else {
      transactions = await Transaction.find({ userId: decoded.userId }).sort({ transactionDate: -1, createdAt: -1 });
    }

    return NextResponse.json({ transactions });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST - Admin creates a transaction
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    const {
      userId,
      type,
      amount,
      currency,
      description,
      status,
      senderName,
      receiverName,
      transactionDate,
      updateBalance,
    } = await req.json();

    if (!userId || !type || amount === undefined) {
      return NextResponse.json({ error: "userId, type, and amount are required" }, { status: 400 });
    }

    const txStatus = status || "completed";

    // Create the transaction
    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      currency: currency || "USD",
      description: description || "",
      status: txStatus,
      senderName: senderName || "",
      receiverName: receiverName || "",
      transactionDate: transactionDate ? new Date(transactionDate) : null,
    });

    // Update user balance if updateBalance !== false and status is completed
    if (updateBalance !== false && txStatus === "completed") {
      const balanceChange = type === "withdrawal" ? -amount : amount;
      await User.findByIdAndUpdate(userId, { $inc: { balance: balanceChange } });
    }

    const user = await User.findById(userId).select("-password");

    return NextResponse.json({ transaction, user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT - Admin updates transaction status
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    const { transactionId, status } = await req.json();

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // If transitioning to completed, update balance
    if (status === "completed" && transaction.status !== "completed") {
      const balanceChange = transaction.type === "withdrawal" ? -transaction.amount : transaction.amount;
      await User.findByIdAndUpdate(transaction.userId, { $inc: { balance: balanceChange } });
    }

    transaction.status = status;
    await transaction.save();

    return NextResponse.json({ transaction });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
