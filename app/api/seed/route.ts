import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: "admin@octacitybank.com" });
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin account already exists" });
    }

    const hashedPassword = await bcrypt.hash("admin123456", 12);

    await User.create({
      fullName: "Admin",
      email: "admin@octacitybank.com",
      phone: "+1000000000",
      address: "Octa City Bank HQ",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      balance: 0,
    });

    return NextResponse.json({ message: "Admin account created successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed admin" }, { status: 500 });
  }
}
