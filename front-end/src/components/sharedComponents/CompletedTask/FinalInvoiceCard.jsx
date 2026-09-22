import { ShieldCheck, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatInrToUsd } from '../../../utils/currency';

function InvoiceRow({ label, value, subValue, bold = false, highlight = false, negative = false }) {
    return (
        <div
            className={`flex items-center justify-between py-2 ${bold ? 'border-t border-gray-100 mt-1' : 'border-b border-gray-50'}`}
        >
            <span
                className={`text-xs ${bold ? 'font-black text-gray-900 text-sm' : 'text-gray-600'}`}
            >
                {label}
            </span>
            <div className="text-right">
                <span
                    className={`text-xs font-black ${negative ? 'text-amber-700' : highlight ? 'text-[#0A6E5C] text-base sm:text-lg' : bold ? 'text-gray-900 text-sm' : 'text-gray-800'}`}
                >
                    {value}
                </span>
                {subValue && (
                    <p className="text-[10px] text-gray-400 font-medium">{subValue}</p>
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
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-3.5 sm:p-4 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="font-extrabold text-gray-900 text-sm">
                        {isWorker ? "Earnings Breakdown" : "Final Invoice"}
                    </p>
                    {isWorker && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
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

                {!isWorker ? (
                    <div className="mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                        <ShieldCheck size={14} className="text-[#0A6E5C] shrink-0" />
                        <span className="text-xs text-[#0A6E5C] font-semibold">
                            Payment secured by Nexaro Escrow
                        </span>
                    </div>
                ) : (
                    <div className="mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                        <Wallet size={14} className="text-[#0A6E5C] shrink-0" />
                        <span className="text-xs text-[#0A6E5C] font-semibold">
                            Credited directly to your Nexaro Wallet
                        </span>
                    </div>
                )}
            </div>

            {isWorker && (
                <div className="pt-3 border-t border-gray-100 mt-3">
                    <Link
                        to="/worker/earnings"
                        className="w-full py-1.5 rounded-lg border border-gray-200 hover:border-[#0A6E5C] text-gray-700 hover:text-[#0A6E5C] text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-gray-50/60 hover:bg-emerald-50/50"
                    >
                        <Wallet size={13} />
                        Go to Wallet & Earnings
                    </Link>
                </div>
            )}
        </div>
    );
};

export default FinalInvoiceCard;
