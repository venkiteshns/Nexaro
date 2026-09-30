import { Camera, Image, Upload, X } from 'lucide-react'
import { useFormContext } from 'react-hook-form';
import FormError from '../FormComponents/FormError';
import { showError } from '../../../utils/toast';
import { validateImageFile } from '../../../utils/fileValidation';

const TaskPhotos = () => {
    const { register, watch, setValue, getValues, formState: { errors } } = useFormContext();
    const photos = watch('photos') || [];

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const validFiles = [];
        for (const file of files) {
            const validation = validateImageFile(file);
            if (!validation.isValid) {
                showError(validation.message);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            const currentPhotos = getValues('photos') || [];
            const newPhotos = [...currentPhotos, ...validFiles].slice(0, 5);
            setValue('photos', newPhotos, { shouldValidate: true });
        }
        e.target.value = "";
    };

    const handleRemovePhoto = (indexToRemove) => {
        const currentPhotos = getValues('photos') || [];
        const newPhotos = currentPhotos.filter((_, index) => index !== indexToRemove);
        setValue('photos', newPhotos, { shouldValidate: true });
    };

    return (
        <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-gray-100 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm sm:text-base text-[#111827] font-bold mb-3">
                <Camera size={16} className="text-[#0A6E5C]" />
                Task Photos
            </h2>

            <div className="flex gap-2.5 flex-wrap">
                {photos?.length < 5 && (
                    <label
                        className={`w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0A6E5C] hover:bg-emerald-50 transition-all group ${errors.photos ? 'border-red-400 bg-red-50' : 'border-gray-200'
                            }`}
                    >
                        <Upload
                            size={18}
                            className={`mb-1 transition-colors group-hover:text-[#0A6E5C] ${errors.photos ? 'text-red-400' : 'text-gray-400'
                                }`}
                        />
                        <span
                            className={`text-[10px] sm:text-xs transition-colors group-hover:text-[#0A6E5C] ${errors.photos ? 'text-red-400' : 'text-gray-400'
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
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 relative group"
                    >
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`upload-${i}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemovePhoto(i)}
                            className="bg-white hover:bg-red-700 hover:border-red-100 hover:text-white absolute top-1 right-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xs"
                        >
                            <X size={12} className="text-red-600 hover:text-white" />
                        </button>
                    </div>
                ))}

                {Array.from({
                    length: Math.max(0, 4 - photos.length),
                }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-center"
                    >
                        <Image size={18} className="text-gray-300" />
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