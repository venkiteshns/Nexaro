import { ShieldCheck, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatInrToUsd } from '../../../utils/currency';

function InvoiceRow({ label, value, subValue, bold = false, highlight = false, negative = false }) {
    return (
        <div
            className={`flex items-center justify-between py-3 ${bold ? 'border-t border-gray-100 mt-1' : 'border-b border-gray-50'}`}
        >
            <span
                className={`text-sm ${bold ? 'font-black text-gray-900 text-base' : 'text-gray-600'}`}
            >
                {label}
            </span>
            <div className="text-right">
                <span
                    className={`text-sm font-black ${negative ? 'text-amber-700' : highlight ? 'text-[#0A6E5C] text-xl' : bold ? 'text-gray-900 text-base' : 'text-gray-800'}`}
                >
                    {value}
                </span>
                {subValue && (
                    <p className="text-[11px] text-gray-400 font-medium">{subValue}</p>
                )}
            </div>
        </div>
    );
}

const FinalInvoiceCard = ({ invoice, isWorker = false }) => {
    const acceptedBid = Number(invoice?.acceptedBid) || 0;
    const platformFee = Number(invoice?.platformFee) || 0;
    const totalPaid = Number(invoice?.totalPaid) || acceptedBid;
    const creditedAmount = Number(invoice?.creditedAmount) || (acceptedBid - platformFee);

    return (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <p className="font-extrabold text-gray-900 text-base">
                        {isWorker ? "Earnings Breakdown" : "Final Invoice"}
                    </p>
                    {isWorker && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            Paid
                        </span>
                    )}
                </div>

                <InvoiceRow
                    label={isWorker ? "Total Bid Value" : "Accepted Bid"}
                    value={`₹${acceptedBid.toLocaleString('en-IN')}`}
                    subValue={formatInrToUsd(acceptedBid)}
                />

                {isWorker && (
                    <InvoiceRow
                        label="Platform Fee (5%)"
                        value={`- ₹${platformFee.toLocaleString('en-IN')}`}
                        negative={true}
                    />
                )}

                {isWorker ? (
                    <InvoiceRow
                        label="Credited to Wallet"
                        value={`₹${creditedAmount.toLocaleString('en-IN')}`}
                        subValue={formatInrToUsd(creditedAmount)}
                        bold
                        highlight
                    />
                ) : (
                    <InvoiceRow
                        label="Total Paid"
                        value={`₹${totalPaid.toLocaleString('en-IN')}`}
                        subValue={formatInrToUsd(totalPaid)}
                        bold
                        highlight
                    />
                )}

                {/* Escrow badge / Wallet message */}
                {!isWorker ? (
                    <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <ShieldCheck size={16} className="text-[#0A6E5C] shrink-0" />
                        <span className="text-xs text-[#0A6E5C] font-semibold">
                            Payment secured by Nexaro Escrow
                        </span>
                    </div>
                ) : (
                    <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <Wallet size={16} className="text-[#0A6E5C] shrink-0" />
                        <span className="text-xs text-[#0A6E5C] font-semibold">
                            Credited directly to your Nexaro Wallet
                        </span>
                    </div>
                )}
            </div>

            {isWorker && (
                <div className="pt-4 border-t border-gray-100 mt-4">
                    <Link
                        to="/worker/earnings"
                        className="w-full py-2.5 rounded-xl border border-gray-200 hover:border-[#0A6E5C] text-gray-700 hover:text-[#0A6E5C] text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-gray-50/60 hover:bg-emerald-50/50"
                    >
                        <Wallet size={14} />
                        Go to Wallet & Earnings
                    </Link>
                </div>
            )}
        </div>
    );
};

export default FinalInvoiceCard;
