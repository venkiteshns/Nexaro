import { CheckCircle, Circle, ChevronRight, Loader2 } from 'lucide-react';

export const CHECKLIST = [
    { key: 'arrived', label: 'Arrived at location', stepIndex: 1 },
    { key: 'discussed', label: 'Discussed job with poster', stepIndex: 2 },
    { key: 'started', label: 'Started work', stepIndex: 3 },
    { key: 'completed', label: 'Job completed', stepIndex: 4 },
    { key: 'payment', label: 'Payment received', stepIndex: 5 },
];

export const UPDATE_ORDER = ['not_started', 'arrived', 'discussed', 'started', 'completed', 'payment'];

export function doneCount(update) {
    const idx = UPDATE_ORDER.indexOf(update);
    return Math.max(0, idx);
}

export default function JobChecklistCard({
    done,
    pct,
    isUpdating,
    onStepUpdate,
    onRequestComplete,
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <p className="font-extrabold text-gray-900">Job Checklist</p>
                    <p className="text-xs text-gray-400 mt-0.5">Track your progress and update the poster</p>
                </div>
                <span className="text-2xl font-extrabold text-[#0A6E5C]">{pct}%</span>
            </div>

            <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
                <div
                    className="h-full bg-[#0A6E5C] rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <ul className="space-y-2.5">
                {CHECKLIST.map((item) => {
                    const itemDone = item.stepIndex <= done;
                    const isNext = UPDATE_ORDER[done + 1] === item.key;

                    return (
                        <li
                            key={item.key}
                            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all
                                ${itemDone
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : isNext
                                        ? 'bg-white border-gray-300 shadow-sm'
                                        : 'bg-gray-50 border-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {itemDone ? (
                                    <CheckCircle size={18} className="text-[#0A6E5C] shrink-0" />
                                ) : (
                                    <Circle size={18} className="text-gray-300 shrink-0" />
                                )}
                                <span className={`text-sm font-medium ${itemDone ? 'text-[#0A6E5C]' : 'text-gray-500'}`}>
                                    {item.label}
                                </span>
                            </div>

                            {itemDone && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#0A6E5C]">
                                    DONE
                                </span>
                            )}
                            {isNext && !itemDone && item.key !== 'payment' && (
                                <button
                                    onClick={() =>
                                        item.key === 'completed'
                                            ? onRequestComplete()
                                            : onStepUpdate(item.key)
                                    }
                                    disabled={isUpdating}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A6E5C] text-white
                                               text-xs font-bold hover:bg-[#085e4e] transition-all active:scale-[0.97]
                                               disabled:opacity-60 shrink-0 cursor-pointer"
                                >
                                    {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <ChevronRight size={12} />}
                                    Mark Done
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
