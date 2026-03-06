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

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await connectDB();

    const { amount, currency } = await req.json();

    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create pending deposit transaction
    const transaction = await Transaction.create({
      userId: decoded.userId,
      type: "deposit",
      amount: parseFloat(amount),
      currency: currency || "USD",
      status: "pending",
      description: `Top-up request - Use account number: ${user.accountNumber}`,
      transactionDate: new Date(),
    });

    return NextResponse.json({ 
      message: "Top-up request submitted successfully", 
      transaction,
      accountNumber: user.accountNumber
    }, { status: 201 });
    
  } catch (error) {
    console.error("Top-up error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}