import { Building2, Plus, CheckCircle2, ShieldCheck, QrCode } from "lucide-react";

export default function PayoutMethodsCard({
  payoutMethods = [
    {
      id: "pm-1",
      type: "bank",
      bankName: "State Bank of India",
      accountNumber: "4492",
      isPrimary: true,
    },
  ],
  onAddMethodClick,
}) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-gray-100 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Payout Methods</h3>
          <p className="text-xs text-gray-500 mt-0.5">Direct deposit and account destinations</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0A6E5C] flex items-center justify-center">
          <ShieldCheck size={16} />
        </div>
      </div>

      <div className="space-y-3">
        {payoutMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6FAF8] border border-emerald-100 hover:border-emerald-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-[#0A6E5C]">
                {method.type === "upi" ? <QrCode size={18} /> : <Building2 size={18} />}
              </div>
              <div>
                <p className="text-xs font-bold text-[#111827]">{method.bankName}</p>
                <p className="text-[11px] text-gray-400 font-medium">
                  {method.type === "upi" ? method.accountNumber : `•••• ${method.accountNumber}`}
                </p>
              </div>
            </div>

            {method.isPrimary && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100/70 text-[#0A6E5C] border border-emerald-200/80 uppercase tracking-wider">
                PRIMARY
              </span>
            )}
          </div>
        ))}

        {/* Add Payout Method Button */}
        <button
          type="button"
          onClick={onAddMethodClick}
          className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#0A6E5C] hover:bg-emerald-50/40 text-gray-500 hover:text-[#0A6E5C] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Payout Method</span>
        </button>
      </div>
    </div>
  );
}
