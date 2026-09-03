import { IndianRupee } from 'lucide-react';

export default function PosterSummaryCard({ poster, amount }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1 bg-linear-to-r from-[#0A6E5C] to-emerald-400" />
            <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                        {poster?.selfie ? (
                            <img src={poster.selfie} alt={poster?.name || 'Poster'} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl font-extrabold text-[#0A6E5C]">
                                {poster?.name?.charAt(0) || 'P'}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Poster</p>
                        <p className="font-bold text-gray-900">{poster?.name || '—'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Agreed Amount</p>
                    <p className="text-3xl font-extrabold text-[#0A6E5C] flex items-center gap-0.5">
                        <IndianRupee size={20} strokeWidth={3} />
                        {amount}
                    </p>
                </div>
            </div>
        </div>
    );
}
