// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { connectDB } from "@/lib/mongodb";
// import Transaction from "@/models/Transaction";
// import User from "@/models/User";

// const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

// export async function POST(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
//     await connectDB();

//     const {
//       recipientFullName,
//       recipientBankName,
//       bankAddress,
//       routingNumber,
//       accountNumber,
//       accountType,
//       recipientAddress,
//       referenceMemo,
//       amount,
//       currency,
//     } = await req.json();

//     // Validate required fields
//     if (!recipientFullName || !recipientBankName || !bankAddress || !routingNumber || !accountNumber || !accountType || !recipientAddress || !amount) {
//       return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//     }

//     const transferAmount = parseFloat(amount);
//     if (isNaN(transferAmount) || transferAmount <= 0) {
//       return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
//     }

//     // Get user to check balance
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (user.balance < transferAmount) {
//       return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
//     }

//     // Create pending transaction
//     const transaction = await Transaction.create({
//       userId: decoded.userId,
//       type: "transfer",
//       amount: transferAmount,
//       currency: currency || "USD",
//       status: "processing", // Start as processing
//       description: referenceMemo || `Transfer to ${recipientFullName}`,
//       recipientFullName,
//       recipientBankName,
//       bankAddress,
//       routingNumber,
//       accountNumber,
//       accountType,
//       recipientAddress,
//       referenceMemo,
//       transactionDate: new Date(),
//     });

//     return NextResponse.json({ 
//       message: "Transfer initiated successfully", 
//       transaction,
//       status: "processing"
//     }, { status: 201 });
    
//   } catch (error) {
//     console.error("Transfer error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }




// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { connectDB } from "@/lib/mongodb";
// import Transaction from "@/models/Transaction";
// import User from "@/models/User";

// const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

// export async function POST(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
//     await connectDB();

//     const {
//       recipientFullName,
//       recipientBankName,
//       bankAddress,
//       routingNumber,
//       accountNumber,
//       accountType,
//       recipientAddress,
//       referenceMemo,
//       amount,
//     } = await req.json();

//     // Validate required fields
//     if (!recipientFullName || !recipientBankName || !bankAddress || !routingNumber || !accountNumber || !accountType || !recipientAddress || !amount) {
//       return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//     }

//     const transferAmount = parseFloat(amount);
//     if (isNaN(transferAmount) || transferAmount <= 0) {
//       return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
//     }

//     // Get user to check balance
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (user.balance < transferAmount) {
//       return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
//     }

//     // Create pending transaction - DO NOT deduct balance yet
//     const transaction = await Transaction.create({
//       userId: decoded.userId,
//       type: "transfer",
//       amount: transferAmount,
//       currency: user.currency || "USD",
//       status: "pending", // Start as pending
//       description: referenceMemo || `Transfer to ${recipientFullName}`,
//       senderName: user.fullName,
//       receiverName: recipientFullName,
//       recipientFullName,
//       recipientBankName,
//       bankAddress,
//       routingNumber,
//       accountNumber,
//       accountType,
//       recipientAddress,
//       referenceMemo,
//       transactionDate: new Date(),
//     });

//     return NextResponse.json({ 
//       message: "Transfer initiated successfully", 
//       transaction,
//       status: "pending"
//     }, { status: 201 });
    
//   } catch (error) {
//     console.error("Transfer error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "octacitybank-secret-key-2024";

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" }, 
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid token" }, 
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid request body" }, 
        { status: 400 }
      );
    }

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
      currency
    } = body;

    // Validate required fields
    const requiredFields = {
      recipientFullName,
      recipientBankName,
      bankAddress,
      routingNumber,
      accountNumber,
      accountType,
      recipientAddress,
      amount
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` }, 
        { status: 400 }
      );
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" }, 
        { status: 400 }
      );
    }

    // Get user to check balance
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }

    if (user.balance < transferAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" }, 
        { status: 400 }
      );
    }

    // Create pending transaction
    const transaction = await Transaction.create({
      userId: decoded.userId,
      type: "transfer",
      amount: transferAmount,
      currency: currency || user.currency || "USD",
      status: "pending",
      description: referenceMemo || `Transfer to ${recipientFullName}`,
      senderName: user.fullName,
      receiverName: recipientFullName,
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

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: "Transfer initiated successfully", 
        transaction: {
          id: transaction._id,
          amount: transaction.amount,
          status: transaction.status,
          recipientName: transaction.recipientFullName
        }
      }, 
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Transfer error:", error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: "Validation error: " + error.message }, 
          { status: 400 }
        );
      }
      if (error.name === 'MongoServerError' && error.message.includes('E11000')) {
        return NextResponse.json(
          { error: "Duplicate transaction" }, 
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Server error. Please try again later." }, 
      { status: 500 }
    );
  }
}

// Optional: Handle OPTIONS requests for CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

// Optional: Handle GET requests if needed (for debugging)
export async function GET() {
  return NextResponse.json(
    { message: "Transfer API - Use POST to create transfers" }, 
    { status: 200 }
  );
}