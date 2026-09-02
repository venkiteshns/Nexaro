import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, Building2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function WithdrawModal({
  isOpen,
  onClose,
  availableBalance = 1200,
  payoutMethods = [],
  onWithdrawSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState(
    payoutMethods.find((m) => m.isPrimary)?.id || payoutMethods[0]?.id || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;

  const handleMaxClick = () => {
    setAmount(availableBalance.toString());
    setError("");
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || numAmount <= 0) {
      setError("Please enter a valid withdrawal amount");
      return;
    }
    if (numAmount > availableBalance) {
      setError(`Amount exceeds your available balance of ₹${availableBalance.toLocaleString("en-IN")}`);
      return;
    }
    if (numAmount < 100) {
      setError("Minimum withdrawal amount is ₹100");
      return;
    }
    if (!selectedMethodId) {
      setError("Please select a payout method");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      if (onWithdrawSuccess) {
        onWithdrawSuccess(numAmount);
      }
      setTimeout(() => {
        setSuccess(false);
        setAmount("");
        onClose();
      }, 1800);
    }, 1200);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0A6E5C] flex items-center justify-center mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Withdrawal Requested!</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              ₹{numAmount.toLocaleString("en-IN")} will be transferred to your account within 24-48 hours.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0A6E5C] flex items-center justify-center">
                <ArrowUpRight size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Withdraw Funds</h3>
                <p className="text-xs text-gray-500">Transfer earnings to your linked bank account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Available Balance Pill */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#F6FAF8] border border-emerald-100 rounded-2xl">
                <span className="text-xs font-semibold text-gray-500">Available Balance</span>
                <span className="text-sm font-bold text-[#0A6E5C]">
                  ₹{availableBalance.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Withdrawal Amount (₹)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-base font-bold text-gray-400">₹</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-16 py-3 bg-white border border-gray-200 rounded-2xl text-lg font-bold text-[#111827] focus:outline-none focus:border-[#0A6E5C] focus:ring-2 focus:ring-[#0A6E5C]/10 transition-all placeholder:text-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleMaxClick}
                    className="absolute right-3 px-2.5 py-1 rounded-lg text-xs font-bold text-[#0A6E5C] bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Payout Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Transfer To
                </label>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {payoutMethods.map((method) => (
                    <label
                      key={method.id}
                      onClick={() => setSelectedMethodId(method.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        selectedMethodId === method.id
                          ? "border-[#0A6E5C] bg-emerald-50/40 ring-1 ring-[#0A6E5C]"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111827]">{method.bankName}</p>
                          <p className="text-[11px] text-gray-400">•••• {method.accountNumber}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payoutMethod"
                        checked={selectedMethodId === method.id}
                        onChange={() => setSelectedMethodId(method.id)}
                        className="text-[#0A6E5C] focus:ring-[#0A6E5C]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-[11px] text-gray-400 text-center">
                Standard processing time: 24 to 48 business hours. No hidden fees.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || availableBalance <= 0}
                  className="flex-1 py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085a4b] transition-all shadow-md shadow-[#0A6E5C]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Confirm Payout"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
