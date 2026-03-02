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




"use client";

import { useState } from "react";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  accountNumber: string;
  currency: string;
  isTemporary?: boolean;
}

export default function TopUpModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  accountNumber, 
  currency,
  isTemporary = false 
}: TopUpModalProps) {
  const [formData, setFormData] = useState({
    amount: "",
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (amount > 0) {
      onSubmit({ ...formData, currency });
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl w-full max-w-md animate-slide-in-left">
        <div className="p-6 border-b border-[var(--card-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text">Top Up Account</h2>
            <button onClick={onClose} className="text-[var(--muted)] hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Account Number Display - Updated */}
          <div className={`bg-[var(--background)] border rounded-lg p-4 ${
            isTemporary ? 'border-amber-500/30' : 'border-[var(--card-border)]'
          }`}>
            <p className="text-xs text-[var(--muted)] mb-2">Your Account Number for Deposits</p>
            <div className="flex items-center justify-between">
              <p className={`text-lg font-mono font-bold ${isTemporary ? 'text-amber-400' : 'text-blue-400'}`}>
                {accountNumber}
              </p>
              <button
                onClick={copyAccountNumber}
                className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            
            {/* Temporary Account Warning */}
            {isTemporary && (
              <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs text-amber-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  This is a temporary account number. Your permanent number will be assigned after verification.
                </p>
              </div>
            )}
            
            {!isTemporary && (
              <p className="text-xs text-[var(--muted)] mt-2">
                Use this account number when making deposits from external banks
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Amount to Deposit</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-[var(--muted)]">$</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ amount: e.target.value })}
                  step="0.01"
                  min="0"
                  className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your top-up request will be pending until admin approval
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-outline text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary text-white py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-transform disabled:opacity-50"
                disabled={!formData.amount || parseFloat(formData.amount) <= 0}
              >
                Request Top Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}