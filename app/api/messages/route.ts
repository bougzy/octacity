import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

// GET messages for current user (or all messages for admin)
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

    let messages;

    if (decoded.role === "admin") {
      if (userId) {
        // Admin viewing conversation with specific user
        messages = await Message.find({
          $or: [
            { senderId: userId },
            { receiverId: userId },
          ],
        }).sort({ createdAt: 1 });
      } else {
        // Admin: get latest message from each user conversation
        messages = await Message.aggregate([
          {
            $match: {
              senderRole: "user",
            },
          },
          {
            $group: {
              _id: "$senderId",
              lastMessage: { $last: "$content" },
              lastDate: { $last: "$createdAt" },
              senderName: { $last: "$senderName" },
              unreadCount: {
                $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] },
              },
            },
          },
          { $sort: { lastDate: -1 } },
        ]);

        // Also get user details
        const userIds = messages.map((m: { _id: string }) => m._id);
        const users = await User.find({ _id: { $in: userIds } }).select("fullName email");
        const userMap = new Map(users.map((u: { _id: { toString: () => string }; fullName: string; email: string }) => [u._id.toString(), u]));

        messages = messages.map((m: { _id: { toString: () => string }; lastMessage: string; lastDate: Date; senderName: string; unreadCount: number }) => ({
          ...m,
          user: userMap.get(m._id.toString()),
        }));
      }
    } else {
      // Regular user: get their own messages
      messages = await Message.find({
        $or: [
          { senderId: decoded.userId },
          { receiverId: decoded.userId },
        ],
      }).sort({ createdAt: 1 });
    }

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST a new message
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    await connectDB();

    const { content, receiverId } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const sender = await User.findById(decoded.userId);
    if (!sender) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const message = await Message.create({
      senderId: decoded.userId,
      receiverId: receiverId || null,
      senderRole: decoded.role,
      senderName: sender.fullName,
      content,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// PUT - mark messages as read
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    await connectDB();

    const { userId } = await req.json();

    if (decoded.role === "admin" && userId) {
      // Admin marking user messages as read
      await Message.updateMany(
        { senderId: userId, senderRole: "user", isRead: false },
        { isRead: true }
      );
    } else {
      // User marking admin messages as read
      await Message.updateMany(
        { receiverId: decoded.userId, senderRole: "admin", isRead: false },
        { isRead: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
