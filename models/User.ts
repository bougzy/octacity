// import mongoose, { Schema, Document } from "mongoose";

// export interface IUser extends Document {
//   fullName: string;
//   email: string;
//   phone: string;
//   address: string;
//   password: string;
//   role: "user" | "admin";
//   balance: number;
//   currency: string;
//   isVerified: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema = new Schema<IUser>(
//   {
//     fullName: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     phone: { type: String, required: true },
//     address: { type: String, required: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["user", "admin"], default: "user" },
//     balance: { type: Number, default: 0 },
//     currency: { type: String, default: "USD" },
//     isVerified: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);



import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: "user" | "admin";
  balance: number;
  currency: string;
  isVerified: boolean;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

function generateAccountNumber(): string {
  return 'OCB' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    isVerified: { type: Boolean, default: false },
    accountNumber: { type: String, unique: true },
  },
  { timestamps: true }
);

// Don't use pre-save hook - handle in your service layer instead
// Create a separate function for user creation
export async function createUserWithAccountNumber(userData: Partial<IUser>) {
  const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
  
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      const accountNumber = generateAccountNumber();
      const user = new User({
        ...userData,
        accountNumber
      });
      await user.save();
      return user;
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.accountNumber) {
        // Duplicate key error, try again
        attempts++;
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('Failed to generate unique account number');
}

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;