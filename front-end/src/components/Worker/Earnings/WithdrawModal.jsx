import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useWithdrawEarningsMutation } from "../../../store/services/workerApi";

export default function WithdrawModal({
  isOpen,
  onClose,
  availableBalance = 0,
  workerEmail = "",
  onWithdrawSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [withdrawEarnings, { isLoading }] = useWithdrawEarningsMutation();

  // Reset and prefill amount whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(availableBalance ? availableBalance.toString() : "");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workerEmail) {
      setError("No registered email found for this account. A PayPal email is required.");
      return;
    }

    if (!amount || numAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (numAmount > availableBalance) {
      setError(`Amount exceeds your available balance of ₹${availableBalance.toLocaleString("en-IN")}.`);
      return;
    }

    setError("");

    try {
      await withdrawEarnings({ amount: numAmount }).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error("Withdrawal error:", err);
      setError(
        err?.data?.message ||
        err?.message ||
        "PayPal transfer initiation failed. Please try again later."
      );
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="py-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0A6E5C] flex items-center justify-center mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Withdrawal Initiated!</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">
              ₹{numAmount.toLocaleString("en-IN")} has been sent to your PayPal account (<span className="font-semibold text-gray-700">{workerEmail}</span>). It will reflect within 48 hours.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085a4b] transition-all shadow-md shadow-[#0A6E5C]/20 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0A6E5C] flex items-center justify-center">
                <ArrowUpRight size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Withdraw to PayPal</h3>
                <p className="text-xs text-gray-500">Transfer earnings to your linked PayPal account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Available Balance Pill */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#F6FAF8] border border-emerald-100 rounded-2xl">
                <span className="text-xs font-semibold text-gray-500">Available Balance</span>
                <span className="text-sm font-bold text-[#0A6E5C]">
                  ₹{Number(availableBalance || 0).toLocaleString("en-IN")}
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
                    disabled={isLoading || availableBalance <= 0}
                    className="w-full pl-8 pr-16 py-3 bg-white border border-gray-200 rounded-2xl text-lg font-bold text-[#111827] focus:outline-none focus:border-[#0A6E5C] focus:ring-2 focus:ring-[#0A6E5C]/10 transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={handleMaxClick}
                    disabled={isLoading || availableBalance <= 0}
                    className="absolute right-3 px-2.5 py-1 rounded-lg text-xs font-bold text-[#0A6E5C] bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* PayPal Recipient Card */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Transfer Destination
                </label>
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-100/90 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#003087] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                      P
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        PayPal Account
                        <span className="text-[10px] font-bold text-[#0A6E5C] bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                          Primary
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                        {workerEmail || "No registered email"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-[11px] text-gray-400 text-center">
                Payment is initiated immediately and reflects in your account within 48 hours.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || availableBalance <= 0 || !workerEmail}
                  className="flex-1 py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085a4b] transition-all shadow-md shadow-[#0A6E5C]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Initiating...</span>
                    </>
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
