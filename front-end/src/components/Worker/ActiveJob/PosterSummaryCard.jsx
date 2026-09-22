import { IndianRupee } from 'lucide-react';

export default function PosterSummaryCard({ poster, amount }) {
    return (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
            <div className="h-1 bg-linear-to-r from-[#0A6E5C] to-emerald-400" />
            <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                        {poster?.selfie ? (
                            <img src={poster.selfie} alt={poster?.name || 'Poster'} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-base font-extrabold text-[#0A6E5C]">
                                {poster?.name?.charAt(0) || 'P'}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Job Poster</p>
                        <p className="font-bold text-xs sm:text-sm text-gray-900">{poster?.name || '—'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Agreed Amount</p>
                    <p className="text-xl sm:text-2xl font-extrabold text-[#0A6E5C] flex items-center gap-0.5">
                        <IndianRupee size={16} strokeWidth={2.5} />
                        {amount}
                    </p>
                </div>
            </div>
        </div>
    );
}
