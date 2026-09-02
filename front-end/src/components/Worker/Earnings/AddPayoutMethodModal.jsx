import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Building2, QrCode, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AddPayoutMethodModal({ isOpen, onClose, onAddSuccess }) {
  const [activeTab, setActiveTab] = useState("bank"); // "bank" | "upi"
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [holderName, setHolderName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isPrimary, setIsPrimary] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (activeTab === "bank") {
      if (!holderName.trim()) {
        setError("Please enter account holder name");
        return;
      }
      if (!bankName.trim()) {
        setError("Please select or enter bank name");
        return;
      }
      if (!accountNumber || accountNumber.length < 8) {
        setError("Please enter a valid bank account number");
        return;
      }
      if (accountNumber !== confirmAccountNumber) {
        setError("Account numbers do not match");
        return;
      }
      if (!ifscCode || ifscCode.length < 6) {
        setError("Please enter a valid IFSC code");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        if (onAddSuccess) {
          onAddSuccess({
            id: Date.now().toString(),
            type: "bank",
            bankName,
            accountNumber: accountNumber.slice(-4),
            holderName,
            isPrimary,
          });
        }
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }, 1000);
    } else {
      if (!upiId || !upiId.includes("@")) {
        setError("Please enter a valid UPI ID (e.g. user@okhdfcbank)");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        if (onAddSuccess) {
          onAddSuccess({
            id: Date.now().toString(),
            type: "upi",
            bankName: "UPI Payout",
            accountNumber: upiId,
            holderName: "UPI Linked Account",
            isPrimary,
          });
        }
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }, 1000);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
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
            <h3 className="text-xl font-bold text-[#111827]">Payout Method Added!</h3>
            <p className="text-sm text-gray-500 mt-2">
              Your account has been linked and verified successfully.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0A6E5C] flex items-center justify-center">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Add Payout Method</h3>
                <p className="text-xs text-gray-500">Link your preferred bank account or UPI ID</p>
              </div>
            </div>

            {/* Type Toggle Tabs */}
            <div className="flex items-center p-1 bg-[#F6FAF8] border border-emerald-100 rounded-2xl mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("bank")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "bank"
                    ? "bg-white text-[#0A6E5C] shadow-xs border border-emerald-200/60"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Building2 size={15} />
                Bank Account
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upi")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "upi"
                    ? "bg-white text-[#0A6E5C] shadow-xs border border-emerald-200/60"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <QrCode size={15} />
                UPI ID
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {activeTab === "bank" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Carter"
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] focus:outline-none focus:border-[#0A6E5C] focus:ring-1 focus:ring-[#0A6E5C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. State Bank of India, HDFC, ICICI"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] focus:outline-none focus:border-[#0A6E5C] focus:ring-1 focus:ring-[#0A6E5C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Account Number
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] focus:outline-none focus:border-[#0A6E5C] focus:ring-1 focus:ring-[#0A6E5C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Confirm Number
                      </label>
                      <input
                        type="text"
                        placeholder="Re-enter number"
                        value={confirmAccountNumber}
                        onChange={(e) => setConfirmAccountNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] focus:outline-none focus:border-[#0A6E5C] focus:ring-1 focus:ring-[#0A6E5C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SBIN0001234"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] uppercase focus:outline-none focus:border-[#0A6E5C] focus:ring-1 focus:ring-[#0A6E5C]"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Virtual Payment Address (UPI ID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. username@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] focus:outline-none focus:border-[#0A6E5C] focus:ring-1 focus:ring-[#0A6E5C]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Direct instant transfers via Google Pay, PhonePe, Paytm or BHIM.
                  </p>
                </div>
              )}

              {/* Primary checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded text-[#0A6E5C] focus:ring-[#0A6E5C]"
                />
                <span className="text-xs text-gray-600 font-medium">
                  Set as primary payout method
                </span>
              </label>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085a4b] transition-all shadow-md shadow-[#0A6E5C]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save Method"
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
