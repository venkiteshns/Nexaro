import { useRef } from 'react'
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


const BidForm = ({ task, bidLoading, deadline }) => {

    const minDate = new Date().toLocaleDateString('en-CA');
    const maxDate = deadline ? new Date(deadline).toLocaleDateString('en-CA') : '';
    const formattedDeadline = deadline
        ? new Date(deadline).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : '';


    const navigate = useNavigate();

    const { register, formState: { errors }, watch, setValue } = useFormContext();
    const timeInputRef = useRef(null);

    const bidAmount = watch("bidAmount") || 0;
    const estimatedTime = watch("estimatedTime") || "";

    setValue('taskId', task?._id);

    return (
        <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-4 sm:h-5 rounded-full bg-[#0A6E5C] block" />
                    <h2 className="text-sm sm:text-base font-extrabold text-gray-900">
                        Place Your Bid
                    </h2>
                </div>

                <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">
                        Your Price
                    </label>
                    <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 focus-within:border-[#0A6E5C] focus-within:ring-2 focus-within:ring-emerald-100 transition-all bg-white">
                        <span className="text-[#0A6E5C] font-extrabold text-base sm:text-lg">₹</span>
                        <input
                            type="number"
                            {...register("bidAmount", { required: "Please enter your bid amount", min: { value: 1, message: "Amount should be above 0" } })}
                            className="flex-1 outline-none text-gray-900 font-bold text-base sm:text-xl bg-transparent"
                            placeholder="0"
                        />
                    </div>
                    {errors.bidAmount && (
                        <FormError error={errors.bidAmount} />
                    )}
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                        Poster's budget:{" "}
                        <span className="font-semibold text-gray-600">₹{task.amount}</span>
                    </p>

                    <div className="mt-2 flex items-center gap-2 bg-[#F0FAF7] border border-emerald-100 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5">
                        <Lightbulb size={14} className="text-[#0A6E5C] shrink-0" />
                        <p className="text-[11px] sm:text-xs text-[#0A6E5C] font-medium leading-snug">
                            Workers who bid 10–20% below budget get 3x more acceptances
                        </p>
                    </div>
                </div>

                <Dropdown name="estimatedTime" field="Estimated Time" options={TIME_OPTIONS} />

                <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">
                        Your Pitch
                    </label>
                    <textarea
                        {...register("pitch", { required: "Please enter your pitch", minLength: { value: 10, message: "Pitch must be at least 10 characters" } })}
                        rows={2}
                        placeholder="Why should they hire you?"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:border-[#0A6E5C] focus:ring-2 focus:ring-emerald-100 transition-all sm:rows-3"
                    />
                    {errors.pitch && <FormError error={errors.pitch} />}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className="block text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Your Availability
                        </label>
                        {formattedDeadline && (
                            <span className="text-[11px] sm:text-xs text-gray-400">
                                Deadline: <span className="font-semibold text-gray-700">{formattedDeadline}</span>
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div>
                            <div className="flex items-center gap-1.5 sm:gap-2 border border-gray-200 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 focus-within:border-[#0A6E5C] focus-within:ring-2 focus-within:ring-emerald-100 transition-all bg-white min-w-0">
                                <Calendar size={14} className="text-[#0A6E5C] shrink-0" />
                                <input
                                    {...register("availableDate", {
                                        required: "Please select your availability date",
                                        validate: (value) => {
                                            if (value < minDate) {
                                                return "Availability date cannot be in the past";
                                            }
                                            if (maxDate && value > maxDate) {
                                                return "Availability date must be on or before the deadline";
                                            }
                                            return true;
                                        }
                                    })}
                                    type="date"
                                    min={minDate}
                                    max={maxDate}
                                    className="w-full outline-none text-xs sm:text-sm text-gray-800 font-semibold bg-transparent"
                                />
                            </div>
                            {errors.availableDate && <FormError error={errors.availableDate} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 sm:gap-2 border border-gray-200 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 focus-within:border-[#0A6E5C] focus-within:ring-2 focus-within:ring-emerald-100 transition-all bg-white min-w-0">
                                <Clock
                                    size={14}
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
                                    className="w-full outline-none text-xs sm:text-sm text-gray-800 font-semibold bg-transparent"
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

                <div className="flex items-center justify-around py-2 sm:py-2.5 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Your Bid
                        </p>
                        <p className="text-base sm:text-xl font-extrabold text-gray-900 mt-0.5">
                            ₹ {bidAmount || 0}
                        </p>
                    </div>
                    <div className="w-px h-8 sm:h-10 bg-gray-200" />
                    <div className="text-center">
                        <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            ETA
                        </p>
                        <p className="text-base sm:text-xl font-extrabold text-gray-900 mt-0.5">
                            {estimatedTime.replace(" hours", "hrs").replace(" hour", "hr").replace(" minutes", "min")}
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={bidLoading}
                    className="w-full py-2.5 sm:py-3.5 rounded-xl bg-[#0A6E5C] hover:bg-[#085e4e] active:scale-[0.98] transition-all text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-200 cursor-pointer"
                >
                    {bidLoading ? <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                    </span> : "Submit Bid"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full py-1 sm:py-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-800 font-semibold transition-colors cursor-pointer"
                >
                    Cancel
                </button>
            </div>

        </div>
    )
}

export default BidForm