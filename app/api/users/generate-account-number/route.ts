import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

function generateAccountNumber(): string {
  return 'OCB' + Date.now().toString().slice(-8) + 
         Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.accountNumber) {
      return NextResponse.json({ accountNumber: user.accountNumber });
    }

    // Generate unique account number
    let isUnique = false;
    let attempts = 0;
    let accountNumber = '';

    while (!isUnique && attempts < 10) {
      accountNumber = generateAccountNumber();
      const existing = await User.findOne({ accountNumber });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({ error: "Failed to generate unique account number" }, { status: 500 });
    }

    user.accountNumber = accountNumber;
    await user.save();

    return NextResponse.json({ accountNumber });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}