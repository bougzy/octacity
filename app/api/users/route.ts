// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";

// const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
//     if (decoded.role !== "admin") {
//       return NextResponse.json({ error: "Admin access required" }, { status: 403 });
//     }

//     await connectDB();
//     const users = await User.find().select("-password").sort({ createdAt: -1 });

//     return NextResponse.json({ users });
//   } catch {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
//     if (decoded.role !== "admin") {
//       return NextResponse.json({ error: "Admin access required" }, { status: 403 });
//     }

//     const { userId, balance, isVerified, role } = await req.json();

//     await connectDB();
//     const update: Record<string, unknown> = {};
//     if (balance !== undefined) update.balance = balance;
//     if (isVerified !== undefined) update.isVerified = isVerified;
//     if (role !== undefined) update.role = role;

//     const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password");

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ user });
//   } catch {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

export async function GET(req: NextRequest) {
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
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

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

    const body = await req.json();
    const { userId, balance, isVerified, role, createdAt } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectDB();

    const update: Record<string, unknown> = {};
    if (balance !== undefined) update.balance = balance;
    if (isVerified !== undefined) update.isVerified = isVerified;
    if (role !== undefined) update.role = role;
    // Allow backdating the account creation date
    if (createdAt !== undefined) {
      const parsedDate = new Date(createdAt);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: "Invalid createdAt date" }, { status: 400 });
      }
      update.createdAt = parsedDate;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      // Use $set so that createdAt (normally immutable in some setups) gets updated too
      { $set: update },
      { new: true, timestamps: false }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}