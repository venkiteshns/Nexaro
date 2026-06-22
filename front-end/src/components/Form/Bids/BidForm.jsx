import { useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import FormError from '../FormComponents/FormError';
import Dropdown from '../../Custom/Dropdown';
import { Calendar, Clock, Lightbulb, Loader2 } from 'lucide-react';

const TIME_OPTIONS = [
    "30 minutes",
    "1 hour",
    "1.5 hours",
    "2 hours",
    "2.5 hours",
    "3 hours",
    "4 hours",
    "5+ hours",
];


const BidForm = ({ task, bidLoading }) => {

    const navigate = useNavigate();


    const { register, formState: { errors }, watch, setValue } = useFormContext();
    const timeInputRef = useRef(null);

    const bidAmount = watch("bidAmount") || 0;
    const estimatedTime = watch("estimatedTime") || "";

    useEffect(() => {
        setValue('taskId', task._id);
        // setValue('workerId',)
    }, [task])

    return (
        <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-5">
                {/* Section header */}
                <div className="flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-[#0A6E5C] block" />
                    <h2 className="text-base font-extrabold text-gray-900">
                        Place Your Bid
                    </h2>
                </div>

                {/* YOUR PRICE */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        Your Price
                    </label>
                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#0A6E5C] focus-within:ring-2 focus-within:ring-emerald-100 transition-all bg-white">
                        <span className="text-[#0A6E5C] font-extrabold text-lg">₹</span>
                        <input
                            type="number"
                            {...register("bidAmount", { required: "Please enter your bid amount", min: { value: 1, message: "Amount should be above 0" } })}
                            className="flex-1 outline-none text-gray-900 font-bold text-xl bg-transparent"
                        />
                    </div>
                    {errors.bidAmount && (
                        <FormError error={errors.bidAmount} />
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">
                        Poster's budget:{" "}
                        <span className="font-semibold text-gray-600">₹{task.amount}</span>
                    </p>

                    {/* Tip banner */}
                    <div className="mt-3 flex items-center gap-2 bg-[#F0FAF7] border border-emerald-100 rounded-xl px-4 py-3">
                        <Lightbulb size={15} className="text-[#0A6E5C] shrink-0" />
                        <p className="text-xs text-[#0A6E5C] font-medium">
                            Workers who bid 10–20% below budget get 3x more acceptances
                        </p>
                    </div>
                </div>

                {/* ESTIMATED TIME */}
                <Dropdown name="estimatedTime" field="Estimated Time" options={TIME_OPTIONS} />

                {/* YOUR PITCH */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        Your Pitch
                    </label>
                    <textarea
                        {...register("pitch", { required: "Please enter your pitch", minLength: { value: 10, message: "Pitch must be at least 10 characters" } })}
                        rows={4}
                        placeholder="Why should they hire you?"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:border-[#0A6E5C] focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                    {errors.pitch && <FormError error={errors.pitch} />}
                </div>

                {/* YOUR AVAILABILITY */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        Your Availability
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            {/* Date picker */}
                            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#0A6E5C] focus-within:ring-2 focus-within:ring-emerald-100 transition-all bg-white">
                                <Calendar size={15} className="text-[#0A6E5C] shrink-0" />
                                <input
                                    {...register("availableDate", { required: "Please select your availability date" })}
                                    type="date"
                                    className="flex-1 outline-none text-sm text-gray-800 font-semibold bg-transparent"
                                />
                            </div>
                            {errors.availableDate && <FormError error={errors.availableDate} />}

                        </div>
                        {/* Time picker */}
                        <div>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#0A6E5C] focus-within:ring-2 focus-within:ring-emerald-100 transition-all bg-white">
                                <Clock
                                    size={15}
                                    className="text-[#0A6E5C] shrink-0 cursor-pointer"
                                    onClick={() => timeInputRef.current?.showPicker()}
                                />
                                <input
                                    {...register("availableTime", { required: "Please select your availability time" })}
                                    ref={(el) => {
                                        register("availableTime").ref(el);
                                        timeInputRef.current = el;
                                    }}
                                    type="time"
                                    className="flex-1 outline-none text-sm text-gray-800 font-semibold bg-transparent"
                                    style={{
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        appearance: 'none',
                                    }}
                                />
                            </div>
                            {errors.availableTime && <FormError error={errors.availableTime} />}
                        </div>
                    </div>
                </div>

                {/* ── Summary strip ── */}
                <div className="flex items-center justify-around py-3 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Your Bid
                        </p>
                        <p className="text-xl font-extrabold text-gray-900 mt-0.5">
                            ₹ {bidAmount || 0}
                        </p>
                    </div>
                    <div className="w-px h-10 bg-gray-200" />
                    <div className="text-center">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            ETA
                        </p>
                        <p className="text-xl font-extrabold text-gray-900 mt-0.5">
                            {estimatedTime.replace(" hours", "hrs").replace(" hour", "hr").replace(" minutes", "min")}
                        </p>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={bidLoading}
                    className="w-full py-3.5 rounded-xl bg-[#0A6E5C] hover:bg-[#085e4e] active:scale-[0.98] transition-all text-white font-bold text-base shadow-md shadow-emerald-200"
                >
                    {bidLoading ? <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                    </span> : "Submit Bid"}
                </button>

                {/* Cancel */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 font-semibold transition-colors"
                >
                    Cancel
                </button>
            </div>

        </div>
    )
}

export default BidForm