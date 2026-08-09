import { Controller, useForm, useWatch } from 'react-hook-form';

import { CheckCircle, Loader2 } from 'lucide-react';
import RatingInput from './RatingInput';
import { useSubmitReviewMutation } from '../../../store/services/posterApi';

const MIN_CHARS = 10;
const MAX_CHARS = 1000;

/**
 * ReviewForm — react-hook-form powered review form.
 *
 * Props:
 *   taskId      {string}
 *   revieweeId  {string}  worker's user ID
 *   workerName  {string}
 *   onSuccess   {function} called with taskId after successful submission
 */
const ReviewForm = ({ taskId, revieweeId, workerName, onSuccess }) => {
    const [submitReview, { isLoading }] = useSubmitReviewMutation();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitSuccessful },
        setError,
    } = useForm({
        defaultValues: {
            rating: 0,
            review: '',
        },
    });


    const reviewText = useWatch({ control, name: 'review' });
    const charCount = reviewText?.length ?? 0;

    const onSubmit = async (data) => {
        try {
            await submitReview({
                taskId,
                reviewee: revieweeId,
                rating: data.rating,
                review: data.review,
            }).unwrap();
            // Redirect handled by parent after success
            if (onSuccess) onSuccess(taskId);
        } catch (err) {
            const message =
                err?.data?.message ||
                'Something went wrong. Please try again.';
            setError('root', { message });
        }
    };

    // ── Success state ──────────────────────────────────────────────────────
    if (isSubmitSuccessful) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                    <CheckCircle size={30} className="text-[#0A6E5C]" />
                </div>
                <div>
                    <p className="text-lg font-extrabold text-gray-900">Review Submitted!</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Thank you for your feedback on {workerName}.
                    </p>
                </div>
                <p className="text-xs text-gray-400">Redirecting you to the task summary…</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* ── Rate your experience ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-4">
                <h2 className="text-gray-900 font-extrabold text-lg mb-1">Rate Your Experience</h2>
                <p className="text-gray-500 text-sm mb-5">
                    How would you describe the service provided by {workerName}?
                </p>

                <Controller
                    name="rating"
                    control={control}
                    rules={{
                        validate: (v) => v >= 1 || 'Please select a rating.',
                    }}
                    render={({ field }) => (
                        <RatingInput
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.rating?.message}
                        />
                    )}
                />
            </div>


            {/* ── Share your feedback ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-4">
                <h2 className="font-extrabold text-gray-900 text-lg mb-0.5">Share Your Feedback</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Detailed Written Testimonial
                </p>

                <div className="relative">
                    <textarea
                        id="review-text"
                        rows={5}
                        placeholder="Describe the quality of work and your experience with the worker…"
                        maxLength={MAX_CHARS}
                        className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400
                                    focus:outline-none focus:ring-2 transition-all duration-150
                                    ${errors.review
                                ? 'border-red-300 focus:ring-red-200'
                                : 'border-gray-200 focus:ring-[#0A6E5C]/20 focus:border-[#0A6E5C]'
                            }`}
                        {...register('review', {
                            required: 'Please enter your review.',
                            validate: {
                                notWhitespace: (v) =>
                                    v.trim().length >= MIN_CHARS ||
                                    `Review must contain at least ${MIN_CHARS} characters.`,
                                maxLength: (v) =>
                                    v.trim().length <= MAX_CHARS ||
                                    `Review must not exceed ${MAX_CHARS} characters.`,
                            },
                        })}
                    />
                </div>

                {/* Char count + validation error row */}
                <div className="flex items-center justify-between mt-2">
                    {errors.review ? (
                        <p className="text-xs text-red-500 font-medium">{errors.review.message}</p>
                    ) : (
                        <span />
                    )}
                    <p
                        className={`text-xs font-medium ml-auto ${charCount > MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}
                    >
                        {charCount}/{MAX_CHARS}
                    </p>
                </div>
            </div>

            {/* ── API / root error ── */}
            {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                    <p className="text-sm text-red-600 font-medium">{errors.root.message}</p>
                </div>
            )}

            {/* ── Submit ── */}
            <button
                id="submit-review-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-[#0A6E5C] text-white font-bold text-sm
                           hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150
                           disabled:opacity-60 disabled:cursor-not-allowed shadow-md
                           flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting…
                    </>
                ) : (
                    'Submit Review'
                )}
            </button>
        </form>
    );
};

export default ReviewForm;
