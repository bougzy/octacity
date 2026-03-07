

// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { connectDB } from "@/lib/mongodb";
// import Transaction from "@/models/Transaction";
// import User from "@/models/User";

// const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

// // GET transactions
// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     let transactions;

//     if (decoded.role === "admin") {
//       if (userId) {
//         transactions = await Transaction.find({ userId }).sort({ transactionDate: -1, createdAt: -1 });
//       } else {
//         transactions = await Transaction.find()
//           .populate("userId", "fullName email")
//           .sort({ transactionDate: -1, createdAt: -1 });
//       }
//     } else {
//       transactions = await Transaction.find({ userId: decoded.userId }).sort({
//         transactionDate: -1,
//         createdAt: -1,
//       });
//     }

//     return NextResponse.json({ transactions });
//   } catch {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }

// // POST - Admin creates a transaction manually
// export async function POST(req: NextRequest) {
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

//     const {
//       userId,
//       type,
//       amount,
//       currency,
//       description,
//       status,
//       senderName,
//       receiverName,
//       transactionDate,
//       updateBalance,
//     } = await req.json();

//     if (!userId || !type || amount === undefined) {
//       return NextResponse.json({ error: "userId, type, and amount are required" }, { status: 400 });
//     }

//     const txStatus = status || "completed";

//     // Create the transaction
//     const transaction = await Transaction.create({
//       userId,
//       type,
//       amount,
//       currency: currency || "USD",
//       description: description || "",
//       status: txStatus,
//       senderName: senderName || "",
//       receiverName: receiverName || "",
//       transactionDate: transactionDate ? new Date(transactionDate) : null,
//     });

//     // Update user balance if updateBalance !== false and status is completed
//     if (updateBalance !== false && txStatus === "completed") {
//       const balanceChange =
//         type === "withdrawal" || type === "donation" || type === "transfer" ? -amount : amount;
//       await User.findByIdAndUpdate(userId, { $inc: { balance: balanceChange } });
//     }

//     const user = await User.findById(userId).select("-password");

//     return NextResponse.json({ transaction, user }, { status: 201 });
//   } catch {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // PUT - Admin approves or rejects a pending/processing transaction
// export async function PUT(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
//     if (decoded.role !== "admin") {
//       return NextResponse.json({ error: "Admin access required" }, { status: 403 });
//     }

//     await connectDB();

//     const { transactionId, status } = await req.json();

//     if (!transactionId || !status) {
//       return NextResponse.json({ error: "transactionId and status are required" }, { status: 400 });
//     }

//     const transaction = await Transaction.findById(transactionId);
//     if (!transaction) {
//       return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
//     }

//     const previousStatus = transaction.status;

//     // Only act if the transaction was pending/processing (not already resolved)
//     if (previousStatus !== "processing" && previousStatus !== "pending") {
//       return NextResponse.json(
//         { error: "Transaction has already been resolved" },
//         { status: 400 }
//       );
//     }

//     if (status === "completed") {
//       // Transfer: balance was already deducted on creation — nothing more to do
//       // For deposit/grant types created by admin with processing status — credit the user
//       if (transaction.type === "deposit" || transaction.type === "grant") {
//         await User.findByIdAndUpdate(transaction.userId, {
//           $inc: { balance: transaction.amount },
//         });
//       }
//       // Transfers/withdrawals: already deducted, just mark complete
//     } else if (status === "failed") {
//       // Refund: return money to user for transfers and withdrawals that were deducted
//       if (
//         transaction.type === "transfer" ||
//         transaction.type === "withdrawal"
//       ) {
//         await User.findByIdAndUpdate(transaction.userId, {
//           $inc: { balance: transaction.amount },
//         });
//       }
//     }

//     // Update transaction status and set approval metadata
//     transaction.status = status;
//     if (status === "completed") {
//       transaction.approvedBy = decoded.userId as any;
//       transaction.approvedAt = new Date();
//     }
//     await transaction.save();

//     return NextResponse.json({ transaction });
//   } catch (error) {
//     console.error("Transaction update error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


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
        // Per-user history for admin viewing a specific user
        transactions = await Transaction.find({ userId }).sort({
          transactionDate: -1,
          createdAt: -1,
        });
      } else {
        // All transactions with user info populated
        transactions = await Transaction.find()
          .populate("userId", "fullName email")
          .sort({ transactionDate: -1, createdAt: -1 });
      }
    } else {
      // Regular user: only their own transactions
      transactions = await Transaction.find({ userId: decoded.userId }).sort({
        transactionDate: -1,
        createdAt: -1,
      });
    }

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("GET transactions error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST - Admin creates a transaction manually (backdated history, deposits, etc.)
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
      return NextResponse.json(
        { error: "userId, type, and amount are required" },
        { status: 400 }
      );
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
      const balanceChange =
        type === "withdrawal" || type === "donation" || type === "transfer"
          ? -amount
          : amount;
      await User.findByIdAndUpdate(userId, { $inc: { balance: balanceChange } });
    }

    const user = await User.findById(userId).select("-password");

    return NextResponse.json({ transaction, user }, { status: 201 });
  } catch (error) {
    console.error("POST transaction error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT - Admin approves or rejects a pending/processing transaction
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    const { transactionId, status } = await req.json();

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: "transactionId and status are required" },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const previousStatus = transaction.status;

    // Only act if transaction is still in a resolvable state
    if (previousStatus !== "processing" && previousStatus !== "pending") {
      return NextResponse.json(
        { error: "Transaction has already been resolved" },
        { status: 400 }
      );
    }

    if (status === "completed") {
      // For deposits/grants that were created with processing status — credit the user now
      if (transaction.type === "deposit" || transaction.type === "grant") {
        await User.findByIdAndUpdate(transaction.userId, {
          $inc: { balance: transaction.amount },
        });
      }
      // For transfers/withdrawals: balance was already deducted on creation, just mark complete
    } else if (status === "failed") {
      // Refund: return money to user for transfers and withdrawals that had balance deducted
      if (transaction.type === "transfer" || transaction.type === "withdrawal") {
        await User.findByIdAndUpdate(transaction.userId, {
          $inc: { balance: transaction.amount },
        });
      }
    }

    // Update transaction status and approval metadata
    transaction.status = status;
    if (status === "completed") {
      transaction.approvedBy = decoded.userId as any;
      transaction.approvedAt = new Date();
    }
    await transaction.save();

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error("PUT transaction error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}