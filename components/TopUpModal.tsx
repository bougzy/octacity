// "use client";

// import { useState } from "react";

// interface TopUpModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
//   accountNumber: string;
//   currency: string;
// }

// export default function TopUpModal({ isOpen, onClose, onSubmit, accountNumber, currency }: TopUpModalProps) {
//   const [formData, setFormData] = useState({
//     amount: "",
//   });
//   const [copied, setCopied] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const amount = parseFloat(formData.amount);
//     if (amount > 0) {
//       onSubmit({ ...formData, currency });
//     }
//   };

//   const copyAccountNumber = () => {
//     navigator.clipboard.writeText(accountNumber);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
//       <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl w-full max-w-md animate-slide-in-left">
//         <div className="p-6 border-b border-[var(--card-border)]">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-bold gradient-text">Top Up Account</h2>
//             <button onClick={onClose} className="text-[var(--muted)] hover:text-white transition-colors">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Account Number Display */}
//           <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg p-4">
//             <p className="text-xs text-[var(--muted)] mb-2">Your Account Number for Deposits</p>
//             <div className="flex items-center justify-between">
//               <p className="text-lg font-mono font-bold text-blue-400">{accountNumber}</p>
//               <button
//                 onClick={copyAccountNumber}
//                 className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1"
//               >
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                 </svg>
//                 {copied ? "Copied!" : "Copy"}
//               </button>
//             </div>
//             <p className="text-xs text-[var(--muted)] mt-2">
//               Use this account number when making deposits from external banks
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1.5">Amount to Deposit</label>
//               <div className="relative">
//                 <span className="absolute left-4 top-2.5 text-[var(--muted)]">$</span>
//                 <input
//                   type="number"
//                   value={formData.amount}
//                   onChange={(e) => setFormData({ amount: e.target.value })}
//                   step="0.01"
//                   min="0"
//                   className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all"
//                   placeholder="0.00"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
//               <p className="text-xs text-amber-400 flex items-center gap-1">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Your top-up request will be pending until admin approval
//               </p>
//             </div>

//             <div className="flex gap-3 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 btn-outline text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="flex-1 btn-primary text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform"
//               >
//                 Request Top Up
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";

// interface TopUpModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
//   accountNumber: string;
//   currency: string;
//   isTemporary?: boolean;
// }

// export default function TopUpModal({ 
//   isOpen, 
//   onClose, 
//   onSubmit, 
//   accountNumber, 
//   currency,
//   isTemporary = false 
// }: TopUpModalProps) {
//   const [formData, setFormData] = useState({
//     amount: "",
//   });
//   const [copied, setCopied] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const amount = parseFloat(formData.amount);
//     if (amount > 0) {
//       onSubmit({ ...formData, currency });
//     }
//   };

//   const copyAccountNumber = () => {
//     navigator.clipboard.writeText(accountNumber);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
//       <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl w-full max-w-md animate-slide-in-left">
//         <div className="p-6 border-b border-[var(--card-border)]">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-bold gradient-text">Top Up Account</h2>
//             <button onClick={onClose} className="text-[var(--muted)] hover:text-white transition-colors">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Account Number Display - Updated */}
//           <div className={`bg-[var(--background)] border rounded-lg p-4 ${
//             isTemporary ? 'border-amber-500/30' : 'border-[var(--card-border)]'
//           }`}>
//             <p className="text-xs text-[var(--muted)] mb-2">Your Account Number for Deposits</p>
//             <div className="flex items-center justify-between">
//               <p className={`text-lg font-mono font-bold ${isTemporary ? 'text-amber-400' : 'text-blue-400'}`}>
//                 {accountNumber}
//               </p>
//               <button
//                 onClick={copyAccountNumber}
//                 className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1"
//               >
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                 </svg>
//                 {copied ? "Copied!" : "Copy"}
//               </button>
//             </div>
            
//             {/* Temporary Account Warning */}
//             {isTemporary && (
//               <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
//                 <p className="text-xs text-amber-400 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                   This is a temporary account number. Your permanent number will be assigned after verification.
//                 </p>
//               </div>
//             )}
            
//             {!isTemporary && (
//               <p className="text-xs text-[var(--muted)] mt-2">
//                 Use this account number when making deposits from external banks
//               </p>
//             )}
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1.5">Amount to Deposit</label>
//               <div className="relative">
//                 <span className="absolute left-4 top-2.5 text-[var(--muted)]">$</span>
//                 <input
//                   type="number"
//                   value={formData.amount}
//                   onChange={(e) => setFormData({ amount: e.target.value })}
//                   step="0.01"
//                   min="0"
//                   className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all"
//                   placeholder="0.00"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
//               <p className="text-xs text-amber-400 flex items-center gap-1">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Your top-up request will be pending until admin approval
//               </p>
//             </div>

//             <div className="flex gap-3 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 btn-outline text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="flex-1 btn-primary text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform disabled:opacity-50"
//                 disabled={!formData.amount || parseFloat(formData.amount) <= 0}
//               >
//                 Request Top Up
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState } from "react";

// interface TransferModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
//   userBalance: number;
//   currency: string;
// }

// export default function TransferModal({ isOpen, onClose, onSubmit, userBalance, currency }: TransferModalProps) {
//   const [formData, setFormData] = useState({
//     recipientFullName: "",
//     recipientBankName: "",
//     bankAddress: "",
//     routingNumber: "",
//     accountNumber: "",
//     accountType: "checking" as "checking" | "savings",
//     recipientAddress: "",
//     referenceMemo: "",
//     amount: "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   if (!isOpen) return null;

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.recipientFullName.trim()) newErrors.recipientFullName = "Recipient name is required";
//     if (!formData.recipientBankName.trim()) newErrors.recipientBankName = "Bank name is required";
//     if (!formData.bankAddress.trim()) newErrors.bankAddress = "Bank address is required";
//     if (!formData.routingNumber.trim()) newErrors.routingNumber = "Routing number is required";
//     if (!formData.accountNumber.trim()) newErrors.accountNumber = "Account number is required";
//     if (!formData.recipientAddress.trim()) newErrors.recipientAddress = "Recipient address is required";
    
//     const amount = parseFloat(formData.amount);
//     if (!formData.amount) newErrors.amount = "Amount is required";
//     else if (isNaN(amount) || amount <= 0) newErrors.amount = "Please enter a valid amount";
//     else if (amount > userBalance) newErrors.amount = "Insufficient balance";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setIsSubmitting(true);
//       try {
//         await onSubmit(formData);
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleAccountTypeChange = (type: "checking" | "savings") => {
//     setFormData(prev => ({ ...prev, accountType: type }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
//       <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-left">
//         <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--card-border)] p-6 flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold gradient-text">Make a Transfer</h2>
//             <p className="text-xs text-[var(--muted)] mt-1">
//               Available Balance: ${userBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} {currency}
//             </p>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="text-[var(--muted)] hover:text-white transition-colors"
//             disabled={isSubmitting}
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* Recipient's full legal name */}
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Recipient&apos;s Full Legal Name <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="recipientFullName"
//               value={formData.recipientFullName}
//               onChange={handleChange}
//               disabled={isSubmitting}
//               className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                 errors.recipientFullName ? 'border-red-500' : 'border-[var(--card-border)]'
//               }`}
//               placeholder="e.g. John A. Doe"
//             />
//             {errors.recipientFullName && <p className="text-xs text-red-400 mt-1">{errors.recipientFullName}</p>}
//           </div>

//           {/* Recipient bank name */}
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Recipient Bank Name <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="recipientBankName"
//               value={formData.recipientBankName}
//               onChange={handleChange}
//               disabled={isSubmitting}
//               className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                 errors.recipientBankName ? 'border-red-500' : 'border-[var(--card-border)]'
//               }`}
//               placeholder="e.g. Chase Bank, Bank of America"
//             />
//             {errors.recipientBankName && <p className="text-xs text-red-400 mt-1">{errors.recipientBankName}</p>}
//           </div>

//           {/* Bank address */}
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Bank Address <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="bankAddress"
//               value={formData.bankAddress}
//               onChange={handleChange}
//               disabled={isSubmitting}
//               className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                 errors.bankAddress ? 'border-red-500' : 'border-[var(--card-border)]'
//               }`}
//               placeholder="Full bank address with city and country"
//             />
//             {errors.bankAddress && <p className="text-xs text-red-400 mt-1">{errors.bankAddress}</p>}
//           </div>

//           {/* Routing number */}
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Routing Number (Wire Routing) <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="routingNumber"
//               value={formData.routingNumber}
//               onChange={handleChange}
//               disabled={isSubmitting}
//               className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                 errors.routingNumber ? 'border-red-500' : 'border-[var(--card-border)]'
//               }`}
//               placeholder="e.g. 021000021"
//             />
//             {errors.routingNumber && <p className="text-xs text-red-400 mt-1">{errors.routingNumber}</p>}
//           </div>

//           {/* Account number */}
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Account Number <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="accountNumber"
//               value={formData.accountNumber}
//               onChange={handleChange}
//               disabled={isSubmitting}
//               className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                 errors.accountNumber ? 'border-red-500' : 'border-[var(--card-border)]'
//               }`}
//               placeholder="Recipient's account number"
//             />
//             {errors.accountNumber && <p className="text-xs text-red-400 mt-1">{errors.accountNumber}</p>}
//           </div>

//           {/* Account type */}
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Account Type <span className="text-red-400">*</span>
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => handleAccountTypeChange("checking")}
//                 disabled={isSubmitting}
//                 className={`py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                   formData.accountType === "checking"
//                     ? "bg-blue-500 text-white scale-105"
//                     : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--muted)] hover:text-white"
//                 }`}
//               >
//                 Checking
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleAccountTypeChange("savings")}
//                 disabled={isSubmitting}
//                 className={`py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                   formData.accountType === "savings"
//                     ? "bg-blue-500 text-white scale-105"
//                     : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--muted)] hover:text-white"
//                 }`}
//               >
//                 Savings
//               </button>
//             </div>
//           </div>

//           {/* Recipient address */}
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Recipient Address <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="recipientAddress"
//               value={formData.recipientAddress}
//               onChange={handleChange}
//               disabled={isSubmitting}
//               className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                 errors.recipientAddress ? 'border-red-500' : 'border-[var(--card-border)]'
//               }`}
//               placeholder="Recipient's full address"
//             />
//             {errors.recipientAddress && <p className="text-xs text-red-400 mt-1">{errors.recipientAddress}</p>}
//           </div>

//           {/* Amount */}
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Amount <span className="text-red-400">*</span>
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-2.5 text-[var(--muted)]">$</span>
//               <input
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 step="0.01"
//                 min="0"
//                 disabled={isSubmitting}
//                 className={`w-full bg-[var(--background)] border rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                   errors.amount ? 'border-red-500' : 'border-[var(--card-border)]'
//                 }`}
//                 placeholder="0.00"
//               />
//             </div>
//             {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
//           </div>

//           {/* Reference/Memo note */}
//           <div>
//             <label className="block text-sm font-medium mb-1.5">
//               Reference/Memo Note <span className="text-[var(--muted)]">(Optional)</span>
//             </label>
//             <textarea
//               name="referenceMemo"
//               value={formData.referenceMemo}
//               onChange={handleChange}
//               rows={2}
//               disabled={isSubmitting}
//               className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               placeholder="Add a note for this transfer..."
//             />
//           </div>

//           {/* Summary */}
//           {formData.amount && !errors.amount && (
//             <div className="p-4 bg-[var(--background)] border border-blue-500/30 rounded-lg animate-fade-in">
//               <p className="text-xs text-[var(--muted)] mb-2">Transfer Summary</p>
//               <p className="text-sm">
//                 You're sending <span className="text-emerald-400 font-bold">
//                   ${parseFloat(formData.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} {currency}
//                 </span> to
//               </p>
//               <p className="text-xs text-[var(--muted)] mt-1">
//                 {formData.recipientFullName || "Recipient"} • {formData.recipientBankName || "Bank"} • {formData.accountType}
//               </p>
//               <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 This transfer will be processed after admin approval
//               </p>
//             </div>
//           )}

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="flex-1 btn-outline text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex-1 btn-primary text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 'Initiate Transfer'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState } from "react";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  accountNumber: string;
  currency: string;
  isTemporary: boolean;
}

export default function TopUpModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  accountNumber, 
  currency, 
  isTemporary 
}: TopUpModalProps) {
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "bank_transfer" as "bank_transfer" | "card" | "crypto",
    reference: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (amount < 10) {
      newErrors.amount = "Minimum top-up amount is $10";
    } else if (amount > 50000) {
      newErrors.amount = "Maximum top-up amount is $50,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit({
          ...formData,
          amount: parseFloat(formData.amount),
          currency,
          accountNumber,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const getPaymentMethodInstructions = () => {
    switch (formData.paymentMethod) {
      case "bank_transfer":
        return (
          <div className="space-y-2">
            <p className="text-sm text-[var(--muted)]">Send funds to:</p>
            <div className="bg-[var(--background)] p-3 rounded-lg space-y-1">
              <p className="text-xs"><span className="text-[var(--muted)]">Bank:</span> Octa City Bank</p>
              <p className="text-xs"><span className="text-[var(--muted)]">Account Name:</span> Octa City Bank Holdings</p>
              <p className="text-xs"><span className="text-[var(--muted)]">Account Number:</span> 1234567890</p>
              <p className="text-xs"><span className="text-[var(--muted)]">Routing:</span> 021000021</p>
              <p className="text-xs"><span className="text-[var(--muted)]">Reference:</span> <span className="text-blue-400 font-mono">{accountNumber.slice(-6)}</span></p>
            </div>
          </div>
        );
      case "card":
        return (
          <div className="space-y-2">
            <p className="text-sm text-[var(--muted)]">You'll be redirected to our secure payment partner to complete your card payment.</p>
            <p className="text-xs text-amber-400">⚠️ Card payments incur a 2.5% processing fee</p>
          </div>
        );
      case "crypto":
        return (
          <div className="space-y-2">
            <p className="text-sm text-[var(--muted)]">Send crypto to:</p>
            <div className="bg-[var(--background)] p-3 rounded-lg space-y-1">
              <p className="text-xs"><span className="text-[var(--muted)]">BTC:</span> bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
              <p className="text-xs"><span className="text-[var(--muted)]">ETH:</span> 0x742d35Cc6634C0532925a3b844Bc1e7f8c5d3c7b</p>
              <p className="text-xs"><span className="text-[var(--muted)]">USDT (ERC20):</span> 0x742d35Cc6634C0532925a3b844Bc1e7f8c5d3c7b</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in-left">
        <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--card-border)] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold gradient-text">Top Up Account</h2>
            <p className="text-xs text-[var(--muted)] mt-1">Add funds to your account</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-[var(--muted)] hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Account Number Display */}
          <div className="p-3 bg-[var(--background)] rounded-lg">
            <p className="text-xs text-[var(--muted)] mb-1">Your Account Number</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono font-bold text-blue-400">{accountNumber}</p>
              {isTemporary && (
                <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">
                  Temporary
                </span>
              )}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Amount <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-[var(--muted)]">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="10"
                max="50000"
                disabled={isSubmitting}
                className={`w-full bg-[var(--background)] border rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.amount ? 'border-red-500' : 'border-[var(--card-border)]'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
            <p className="text-xs text-[var(--muted)] mt-1">Min: $10 | Max: $50,000</p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Payment Method <span className="text-red-400">*</span>
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="bank_transfer">Bank Transfer (Free)</option>
              <option value="card">Credit/Debit Card (+2.5% fee)</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
          </div>

          {/* Reference (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Reference <span className="text-[var(--muted)]">(Optional)</span>
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g. Savings, Emergency fund"
            />
          </div>

          {/* Payment Instructions */}
          {formData.amount && !errors.amount && (
            <div className="p-4 bg-[var(--background)] border border-blue-500/30 rounded-lg animate-fade-in">
              <p className="text-xs text-blue-400 font-medium mb-3">Payment Instructions</p>
              {getPaymentMethodInstructions()}
              
              {/* Summary */}
              <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Amount:</span>
                  <span className="text-white">${parseFloat(formData.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                {formData.paymentMethod === 'card' && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-[var(--muted)]">Fee (2.5%):</span>
                    <span className="text-amber-400">${(parseFloat(formData.amount) * 0.025).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium mt-1 pt-1 border-t border-[var(--card-border)]">
                  <span className="text-[var(--muted)]">Total to pay:</span>
                  <span className="text-emerald-400">
                    ${(parseFloat(formData.amount) * (formData.paymentMethod === 'card' ? 1.025 : 1)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your top-up will be processed after payment confirmation
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 btn-outline text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.amount}
              className="flex-1 btn-primary text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Submit Top-up Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}