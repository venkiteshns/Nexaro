import { ShieldCheck } from 'lucide-react';

function InvoiceRow({ label, value, bold = false, highlight = false }) {
    return (
        <div
            className={`flex items-center justify-between py-3 ${bold ? 'border-t border-gray-100 mt-1' : 'border-b border-gray-50'}`}
        >
            <span
                className={`text-sm ${bold ? 'font-extrabold text-gray-900 text-base' : 'text-gray-600'}`}
            >
                {label}
            </span>
            <span
                className={`text-sm font-bold ${highlight ? 'text-[#0A6E5C] text-xl font-extrabold' : bold ? 'text-gray-900 text-base' : 'text-gray-700'}`}
            >
                {value}
            </span>
        </div>
    );
}

const FinalInvoiceCard = ({ invoice }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <p className="font-extrabold text-gray-900 text-base mb-4">Final Invoice</p>

            <InvoiceRow label="Accepted Bid" value={`₹${invoice.acceptedBid.toFixed(2)}`} />
            <InvoiceRow
                label={`Platform Fee (5%)`}
                value={`₹${invoice.platformFee.toFixed(2)}`}
            />
            <InvoiceRow
                label="Total Paid"
                value={`₹${invoice.totalPaid.toFixed(2)}`}
                bold
                highlight
            />

            {/* Escrow badge */}
            <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                <ShieldCheck size={15} className="text-[#0A6E5C] shrink-0" />
                <span className="text-xs text-[#0A6E5C] font-semibold">
                    Payment secured by Nexaro Escrow
                </span>
            </div>
        </div>
    );
};

export default FinalInvoiceCard;
