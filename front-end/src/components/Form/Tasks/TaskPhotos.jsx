import { Camera, Image, Upload, X } from 'lucide-react'
import { useFormContext } from 'react-hook-form';
import FormError from '../FormComponents/FormError';

const TaskPhotos = () => {
    const { register, watch, setValue, getValues, formState: { errors } } = useFormContext();
    const photos = watch('photos') || [];

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const currentPhotos = getValues('photos') || [];

        const newPhotos = [...currentPhotos, ...files].slice(0, 5);

        setValue('photos', newPhotos, { shouldValidate: true });
    };

    const handleRemovePhoto = (indexToRemove) => {
        const currentPhotos = getValues('photos') || [];
        const newPhotos = currentPhotos.filter((_, index) => index !== indexToRemove);
        setValue('photos', newPhotos, { shouldValidate: true });
    };

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="flex items-center gap-2 text-[#111827] font-semibold mb-5">
                <Camera size={18} className="text-[#0A6E5C]" />
                Task Photos
            </h2>

            <div className="flex gap-3 flex-wrap">
                {photos?.length < 5 && (
                    <label
                        className={`w-28 h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#0A6E5C] hover:bg-emerald-50 transition-all group ${errors.photos ? 'border-red-400 bg-red-50' : 'border-gray-200'
                            }`}
                    >
                        <Upload
                            size={22}
                            className={`mb-1 transition-colors group-hover:text-[#0A6E5C] ${errors.photos ? 'text-red-400' : 'text-gray-400'
                                }`}
                        />
                        <span
                            className={`text-xs transition-colors group-hover:text-[#0A6E5C] ${errors.photos ? 'text-red-400' : 'text-gray-400'
                                }`}
                        >
                            Upload Media
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePhotoUpload}
                        />
                    </label>
                )}

                {photos && photos?.map((file, i) => (
                    <div
                        key={i}
                        className="w-28 h-28 rounded-xl overflow-hidden border border-gray-200 relative group"
                    >
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`upload-${i}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemovePhoto(i)}
                            className="bg-white hover:bg-red-700 hover:border-red-100 hover:text-white absolute top-1.5 right-1.5 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                        >
                            <X size={14} className="text-red-600 hover:text-white" />
                        </button>
                    </div>
                ))}

                {Array.from({
                    length: Math.max(0, 4 - photos.length),
                }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="w-28 h-28 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-center"
                    >
                        <Image size={22} className="text-gray-300" />
                    </div>
                ))}
            </div>

            <input
                type="hidden"
                {...register('photos', {
                    validate: (value) => {
                        if (!value || value.length === 0)
                            return 'Please upload at least 1 photo';
                        if (value.length > 5)
                            return 'Maximum 5 photos allowed';
                        return true;
                    },
                })}
            />

            {errors.photos && (
                <FormError error={errors.photos} />
            )}

            <p className="text-xs text-gray-400 mt-2">
                Add up to 5 photos to help workers understand the scale of
                work.
            </p>
        </div>
    )
}

export default TaskPhotos