import { ChevronDown, ClipboardList } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form';
import FormError from './FormError';

const categories = [
    { label: "Cleaning Services", value: "cleaning" },
    { label: "Plumbing", value: "plumbing" },
    { label: "Electrical", value: "electrical" },
    { label: "Home Repair", value: "home_repair" },
    { label: "Gardening", value: "gardening" },
    { label: "Painting", value: "painting" },
    { label: "Moving & Packing", value: "moving" },
    { label: "IT & Tech Support", value: "it_support" },
    { label: "Babysitting", value: "babysitting" },
    { label: "Pet Care", value: "pet_care" },
    { label: "Cooking", value: "cooking" },
    { label: "Delivery", value: "delivery" },
];


const TaskDetails = () => {

    const { register, formState: { errors }, setValue, watch, getValues } = useFormContext();
    const urgency = watch('urgency');

    useEffect(() => {
        if (!getValues('urgency')) {
            setValue('urgency', 'flexible')
        }
    }, [setValue, getValues])

    return (
        <div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h2 className="flex items-center gap-2 text-[#111827] font-semibold mb-5">
                    <ClipboardList size={18} className="text-[#0A6E5C]" />
                    Task Details
                </h2>

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-500 mb-2 font-medium">
                        Task Title
                    </label>
                    <input
                        type="text"
                        {...register('taskTitle', {
                            required: "Please enter the task title",
                            minLength: { value: 3, message: "Title must be at least 3 characters" },
                            maxLength: { value: 250, message: "Title cannot exceed 250 characters" }
                        })}
                        // value={title}
                        // onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Professional Home Deep Cleaning"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#111827] placeholder-gray-400 text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors"
                    />
                    <FormError error={errors?.taskTitle} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                {...register('category', {
                                    required: "Please select a category"
                                })}
                                // value={category}
                                // onChange={(e) => setCategory(e.target.value)}
                                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#111827] text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors cursor-pointer pr-10"
                            >
                                <option value="" className='text-xs text-slate-600' >Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            <FormError error={errors?.category} />
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">
                            Budget (Estimated)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                ₹
                            </span>
                            <input
                                type="number"
                                {...register('budget', {
                                    required: "Please enter the budget",
                                    min: { value: 1, message: "Budget must be above 0" },
                                    max: { value: 100000, message: "Budget cannot exceed 100000" }
                                })}
                                // value={budget}
                                // onChange={(e) => setBudget(e.target.value)}
                                placeholder="5,000"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-[#111827] placeholder-gray-400 text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors"
                            />
                            <FormError error={errors?.budget} />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-500 font-medium">
                            Description
                        </label>
                        <span className="text-xs text-gray-400">
                            {/* {description.length} / 1000 characters */}
                        </span>
                    </div>
                    <textarea
                        {...register('description', {
                            required: "Please enter the description",
                            minLength: { value: 3, message: "Description must be at least 3 characters" },
                            maxLength: { value: 1000, message: "Description cannot exceed 1000 characters" }
                        })}
                        // value={description}
                        // onChange={(e) =>
                        // setDescription(e.target.value.slice(0, 1000))
                        // }
                        placeholder="Detail the work, required skills, and expectations..."
                        rows={5}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#111827] placeholder-gray-400 text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors resize-none"
                    />
                    <FormError error={errors?.description} />
                </div>

                {/* deadline and urgency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">
                            Preferred Deadline
                        </label>
                        <input
                            {...register('deadline', {
                                required: "Please select a deadline",
                                validate: {
                                    futureDate: (value) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);

                                        const [year, month, day] = value.split('-');

                                        const selectedDate = new Date(year, month - 1, day);

                                        return selectedDate >= today || "Please select current or upcoming date";
                                    }
                                }
                            })}
                            type="date"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#111827] text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors"
                        />
                        <FormError error={errors?.deadline} />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">
                            Urgency Level
                        </label>
                        <div className="flex gap-2">
                            {["flexible", "normal", "urgent"].map((level) => (
                                <button type='button'
                                    key={level}
                                    onClick={() => {
                                        setValue('urgency', level, { shouldValidate: true });
                                    }}
                                    className={`flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-all ${urgency === level
                                        ? "bg-[#0A6E5C] text-white shadow-sm"
                                        : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-[#0A6E5C]/50 hover:text-[#0A6E5C]"
                                        }`}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskDetails