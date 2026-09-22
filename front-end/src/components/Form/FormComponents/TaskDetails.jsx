import { ChevronDown, ClipboardList } from 'lucide-react'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form';
import FormError from './FormError';

const categories = [
    { label: "Cleaning Services", value: "Cleaning" },
    { label: "Plumbing", value: "Plumbing" },
    { label: "Electrical", value: "Electrical" },
    { label: "Home Repair", value: "Home Repair" },
    { label: "Gardening", value: "Gardening" },
    { label: "Painting", value: "Painting" },
    { label: "Moving & Packing", value: "Moving" },
    { label: "IT & Tech Support", value: "IT & Tech Support" },
    { label: "Babysitting", value: "Babysitting" },
    { label: "Pet Care", value: "Pet Care" },
    { label: "Cooking", value: "Cooking" },
    { label: "Delivery", value: "Delivery" },
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
            <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-gray-100 shadow-xs">
                <h2 className="flex items-center gap-2 text-sm sm:text-base text-[#111827] font-bold mb-3">
                    <ClipboardList size={16} className="text-[#0A6E5C]" />
                    Task Details
                </h2>

                <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Task Title
                    </label>
                    <input
                        type="text"
                        {...register('taskTitle', {
                            required: "Please enter the task title",
                            minLength: { value: 3, message: "Title must be at least 3 characters" },
                            maxLength: { value: 250, message: "Title cannot exceed 250 characters" }
                        })}
                        placeholder="e.g., Professional Home Deep Cleaning"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[#111827] placeholder-gray-400 text-xs sm:text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors"
                    />
                    <FormError error={errors?.taskTitle} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                {...register('category', {
                                    required: "Please select a category"
                                })}
                                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[#111827] text-xs sm:text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors cursor-pointer pr-8"
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
                                size={14}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">
                            Budget (Estimated)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">
                                ₹
                            </span>
                            <input
                                type="number"
                                {...register('budget', {
                                    required: "Please enter the budget",
                                    min: { value: 1, message: "Budget must be above 0" },
                                    max: { value: 100000, message: "Budget cannot exceed 100000" }
                                })}
                                placeholder="5,000"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-[#111827] placeholder-gray-400 text-xs sm:text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors"
                            />
                            <FormError error={errors?.budget} />
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-gray-500 font-medium">
                            Description
                        </label>
                        <span className="text-xs text-gray-400">
                        </span>
                    </div>
                    <textarea
                        {...register('description', {
                            required: "Please enter the description",
                            minLength: { value: 3, message: "Description must be at least 3 characters" },
                            maxLength: { value: 1000, message: "Description cannot exceed 1000 characters" }
                        })}
                        placeholder="Detail the work, required skills, and expectations..."
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[#111827] placeholder-gray-400 text-xs sm:text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors resize-none"
                    />
                    <FormError error={errors?.description} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">
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
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[#111827] text-xs sm:text-sm outline-none focus:border-[#0A6E5C] focus:bg-white transition-colors"
                        />
                        <FormError error={errors?.deadline} />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">
                            Urgency Level
                        </label>
                        <div className="flex gap-1.5">
                            {["flexible", "normal", "urgent"].map((level) => (
                                <button type='button'
                                    key={level}
                                    onClick={() => {
                                        setValue('urgency', level, { shouldValidate: true });
                                    }}
                                    className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${urgency === level
                                        ? "bg-[#0A6E5C] text-white shadow-xs"
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