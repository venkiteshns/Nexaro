import { CheckCircle, Circle, ChevronRight, Loader2 } from 'lucide-react';

import { CHECKLIST, UPDATE_ORDER } from './jobChecklistUtils';

export default function JobChecklistCard({
    done,
    pct,
    isUpdating,
    onStepUpdate,
    onRequestComplete,
}) {
    return (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-1.5">
                <div>
                    <p className="font-bold text-xs sm:text-sm text-gray-900">Job Checklist</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Track your progress and update the poster</p>
                </div>
                <span className="text-lg sm:text-xl font-extrabold text-[#0A6E5C]">{pct}%</span>
            </div>

            <div className="h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                <div
                    className="h-full bg-[#0A6E5C] rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <ul className="space-y-1.5">
                {CHECKLIST.map((item) => {
                    const itemDone = item.stepIndex <= done;
                    const isNext = UPDATE_ORDER[done + 1] === item.key;

                    return (
                        <li
                            key={item.key}
                            className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg border transition-all
                                ${itemDone
                                    ? 'bg-emerald-50/70 border-emerald-200'
                                    : isNext
                                        ? 'bg-white border-gray-300 shadow-2xs'
                                        : 'bg-gray-50/70 border-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-2.5">
                                {itemDone ? (
                                    <CheckCircle size={15} className="text-[#0A6E5C] shrink-0" />
                                ) : (
                                    <Circle size={15} className="text-gray-300 shrink-0" />
                                )}
                                <span className={`text-xs font-semibold ${itemDone ? 'text-[#0A6E5C]' : 'text-gray-600'}`}>
                                    {item.label}
                                </span>
                            </div>

                            {itemDone && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#0A6E5C]">
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
