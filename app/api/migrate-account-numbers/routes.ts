// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";

// export async function POST() {
//   try {
//     await connectDB();
    
//     // Find users without account numbers
//     const users = await User.find({ 
//       $or: [
//         { accountNumber: { $exists: false } },
//         { accountNumber: null },
//         { accountNumber: "" }
//       ]
//     });
    
//     console.log(`Found ${users.length} users without account numbers`);
    
//     let updated = 0;
//     const errors: { email: string; error: string }[] = [];

//     for (const user of users) {
//       try {
//         // Generate unique account number
//         let isUnique = false;
//         let attempts = 0;
//         const maxAttempts = 10;
//         let accountNumber = '';
        
//         while (!isUnique && attempts < maxAttempts) {
//           // Format: OCB + timestamp (last 8 digits) + random 3 digits
//           accountNumber = 'OCB' + Date.now().toString().slice(-8) + 
//                          Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          
//           const existing = await User.findOne({ accountNumber });
//           if (!existing) {
//             isUnique = true;
//           }
//           attempts++;
//         }
        
//         if (!isUnique) {
//           throw new Error(`Failed to generate unique account number for ${user.email}`);
//         }
        
//         // Update the user
//         user.accountNumber = accountNumber;
//         await user.save();
//         updated++;
        
//         console.log(`Updated ${user.email} with account number: ${accountNumber}`);
//       } catch (error: unknown) {
//         // Type assertion for error
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//         errors.push({ email: user.email, error: errorMessage });
//       }
//     }

//     return NextResponse.json({ 
//       success: true,
//       message: `Updated ${updated} users with account numbers`,
//       errors: errors.length > 0 ? errors : undefined
//     });
    
//   } catch (error: unknown) {
//     console.error('Migration error:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
//     return NextResponse.json({ 
//       success: false,
//       error: errorMessage 
//     }, { status: 500 });
//   }
// }

// // Also add a GET endpoint to check status
// export async function GET() {
//   try {
//     await connectDB();
    
//     const totalUsers = await User.countDocuments();
//     const usersWithAccount = await User.countDocuments({ 
//       accountNumber: { $exists: true, $ne: null, $ne: "" } 
//     });
//     const usersWithoutAccount = await User.countDocuments({ 
//       $or: [
//         { accountNumber: { $exists: false } },
//         { accountNumber: null },
//         { accountNumber: "" }
//       ]
//     });

//     return NextResponse.json({
//       totalUsers,
//       usersWithAccount,
//       usersWithoutAccount
//     });
    
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'Failed to check status';
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }