import { Loader2 } from "lucide-react";

export default function LoadingState({ bid }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="relative">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                    {bid?.worker?.selfie ? (
                        <img src={bid.worker.selfie} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="text-3xl font-extrabold text-[#0A6E5C]">
                            {bid?.worker?.name?.charAt(0) ?? '?'}
                        </span>
                    )}
                </div>
                <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-emerald-200 flex items-center justify-center">
                    <Loader2 size={16} className="text-[#0A6E5C] animate-spin" />
                </span>
            </div>

            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">Accepting bid…</p>
                <p className="text-sm text-gray-500">
                    Notifying{' '}
                    <span className="font-semibold text-gray-700">{bid?.worker?.name ?? 'worker'}</span>
                    {' '}· Securing{' '}
                    <span className="font-semibold text-[#0A6E5C]">₹{bid?.amount}</span>
                </p>
            </div>

            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#0A6E5C] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}