



import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let decoded: { userId: string; role: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const {
      recipientFullName,
      recipientBankName,
      bankAddress,
      routingNumber,
      accountNumber,
      accountType,
      recipientAddress,
      referenceMemo,
      amount,
      currency,
    } = body;

    // Validate required fields
    if (
      !recipientFullName ||
      !recipientBankName ||
      !bankAddress ||
      !routingNumber ||
      !accountNumber ||
      !accountType ||
      !recipientAddress ||
      !amount
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Get user to check balance
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.balance < transferAmount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Deduct balance immediately and hold it pending admin approval
    await User.findByIdAndUpdate(decoded.userId, {
      $inc: { balance: -transferAmount },
    });

    // Create transaction with "processing" status
    const transaction = await Transaction.create({
      userId: decoded.userId,
      type: "transfer",
      amount: transferAmount,
      currency: currency || user.currency || "USD",
      status: "processing",
      description: referenceMemo || `Transfer to ${recipientFullName}`,
      recipientFullName,
      recipientBankName,
      bankAddress,
      routingNumber,
      accountNumber,
      accountType,
      recipientAddress,
      referenceMemo: referenceMemo || "",
      transactionDate: new Date(),
    });

    return NextResponse.json(
      {
        message: "Transfer initiated successfully. Awaiting approval.",
        transaction,
        status: "processing",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Transfer error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}