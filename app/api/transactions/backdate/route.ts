import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const { transactionId, transactionDate } = await req.json();

    if (!transactionId || !transactionDate) {
      return NextResponse.json(
        { error: "transactionId and transactionDate are required" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(transactionDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    const updated = await Transaction.findByIdAndUpdate(
      transactionId,
      { $set: { transactionDate: parsedDate } },
      { new: true, timestamps: false }
    );

    if (!updated) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, transaction: updated });
  } catch (error) {
    console.error("Backdate transaction error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}