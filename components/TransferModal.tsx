"use client";

import { useState } from "react";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  userBalance: number;
  currency: string;
}

export default function TransferModal({ isOpen, onClose, onSubmit, userBalance, currency }: TransferModalProps) {
  const [formData, setFormData] = useState({
    recipientFullName: "",
    recipientBankName: "",
    bankAddress: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
    recipientAddress: "",
    referenceMemo: "",
    amount: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientFullName) newErrors.recipientFullName = "Recipient name is required";
    if (!formData.recipientBankName) newErrors.recipientBankName = "Bank name is required";
    if (!formData.bankAddress) newErrors.bankAddress = "Bank address is required";
    if (!formData.routingNumber) newErrors.routingNumber = "Routing number is required";
    if (!formData.accountNumber) newErrors.accountNumber = "Account number is required";
    if (!formData.recipientAddress) newErrors.recipientAddress = "Recipient address is required";
    
    const amount = parseFloat(formData.amount);
    if (!formData.amount) newErrors.amount = "Amount is required";
    else if (isNaN(amount) || amount <= 0) newErrors.amount = "Please enter a valid amount";
    else if (amount > userBalance) newErrors.amount = "Insufficient balance";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-left">
        <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--card-border)] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold gradient-text">Make a Transfer</h2>
            <p className="text-xs text-[var(--muted)] mt-1">Available Balance: ${userBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} {currency}</p>
          </div>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Recipient's full legal name */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Recipient&apos;s Full Legal Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="recipientFullName"
              value={formData.recipientFullName}
              onChange={handleChange}
              className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all ${errors.recipientFullName ? 'border-red-500' : 'border-[var(--card-border)]'}`}
              placeholder="e.g. John A. Doe"
            />
            {errors.recipientFullName && <p className="text-xs text-red-400 mt-1">{errors.recipientFullName}</p>}
          </div>

          {/* Recipient bank name */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Recipient Bank Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="recipientBankName"
              value={formData.recipientBankName}
              onChange={handleChange}
              className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all ${errors.recipientBankName ? 'border-red-500' : 'border-[var(--card-border)]'}`}
              placeholder="e.g. Chase Bank, Bank of America"
            />
            {errors.recipientBankName && <p className="text-xs text-red-400 mt-1">{errors.recipientBankName}</p>}
          </div>

          {/* Bank address */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Bank Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="bankAddress"
              value={formData.bankAddress}
              onChange={handleChange}
              className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all ${errors.bankAddress ? 'border-red-500' : 'border-[var(--card-border)]'}`}
              placeholder="Full bank address with city and country"
            />
            {errors.bankAddress && <p className="text-xs text-red-400 mt-1">{errors.bankAddress}</p>}
          </div>

          {/* Routing number */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Routing Number (Wire Routing) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleChange}
              className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all ${errors.routingNumber ? 'border-red-500' : 'border-[var(--card-border)]'}`}
              placeholder="e.g. 021000021"
            />
            {errors.routingNumber && <p className="text-xs text-red-400 mt-1">{errors.routingNumber}</p>}
          </div>

          {/* Account number */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Account Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all ${errors.accountNumber ? 'border-red-500' : 'border-[var(--card-border)]'}`}
              placeholder="Recipient's account number"
            />
            {errors.accountNumber && <p className="text-xs text-red-400 mt-1">{errors.accountNumber}</p>}
          </div>

          {/* Account type */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Account Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "checking" })}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  formData.accountType === "checking"
                    ? "bg-blue-500 text-white scale-105"
                    : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--muted)] hover:text-white"
                }`}
              >
                Checking
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "savings" })}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  formData.accountType === "savings"
                    ? "bg-blue-500 text-white scale-105"
                    : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--muted)] hover:text-white"
                }`}
              >
                Savings
              </button>
            </div>
          </div>

          {/* Recipient address */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Recipient Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="recipientAddress"
              value={formData.recipientAddress}
              onChange={handleChange}
              className={`w-full bg-[var(--background)] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all ${errors.recipientAddress ? 'border-red-500' : 'border-[var(--card-border)]'}`}
              placeholder="Recipient's full address"
            />
            {errors.recipientAddress && <p className="text-xs text-red-400 mt-1">{errors.recipientAddress}</p>}
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
                min="0"
                className={`w-full bg-[var(--background)] border rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all ${errors.amount ? 'border-red-500' : 'border-[var(--card-border)]'}`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
          </div>

          {/* Reference/Memo note */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Reference/Memo Note <span className="text-[var(--muted)]">(Optional)</span>
            </label>
            <textarea
              name="referenceMemo"
              value={formData.referenceMemo}
              onChange={handleChange}
              rows={2}
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Add a note for this transfer..."
            />
          </div>

          {/* Summary */}
          {formData.amount && !errors.amount && (
            <div className="p-4 bg-[var(--background)] border border-blue-500/30 rounded-lg animate-fade-in">
              <p className="text-xs text-[var(--muted)] mb-2">Transfer Summary</p>
              <p className="text-sm">
                You're sending <span className="text-emerald-400 font-bold">${parseFloat(formData.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} {currency}</span> to
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">
                {formData.recipientFullName || "Recipient"} • {formData.recipientBankName || "Bank"} • {formData.accountType}
              </p>
              <p className="text-xs text-amber-400 mt-2">⏱️ This transfer will be processed after admin approval</p>
            </div>
          )}

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
            >
              Initiate Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}