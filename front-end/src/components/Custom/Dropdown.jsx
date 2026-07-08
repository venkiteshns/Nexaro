import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import FormError from '../Form/FormComponents/FormError';

const Dropdown = ({ options, name, field }) => {

    const [optionOpen, setOptionOpen] = useState(false);

    const { register, formState: { errors }, watch, setValue } = useFormContext();

    const option = watch(name) || options[0];

    useEffect(() => {
        setValue(name, option);
    }, []);

    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {field}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOptionOpen((p) => !p)}
                    className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold text-gray-800 hover:border-[#0A6E5C] transition-colors"
                >
                    {option}
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${optionOpen ? "rotate-180" : ""}`}
                    />
                </button>
                {optionOpen && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                {...register(name, { required: `Please select ${field}` })}
                                onClick={() => {
                                    setValue(name, opt);
                                    setOptionOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${option === opt
                                    ? "bg-emerald-50 text-[#0A6E5C]"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <FormError error={errors[name]} />
        </div>
    )
}

export default Dropdown