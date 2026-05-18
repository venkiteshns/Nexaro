import React from "react";
import { Upload } from "lucide-react";
import { ID_TYPES } from "../../utils/constants";
import { useFormContext } from "react-hook-form";

const IdentityVerification = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const selected = watch("id_type");
  return (
    <div className="mt-5 w-full rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm">
      {/* Select */}
      <div className="mb-8">
        <label className="mb-3 block text-xs  uppercase tracking-wide text-gray-700">
          Government ID Type <span className="text-red-500">*</span>
        </label>

        <div>
          <select
            defaultValue=""
            {...register("id_type", {
              required: "Please select an id and upload the mentioned data",
            })}
            className={` w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-1 focus:ring-green-800 ${selected ? "text-gray-700" : "text-gray-400"}`}
          >
            <option value="" disabled>
              Select ID type
            </option>
            {ID_TYPES.map((id) => (
              <option key={id} value={id} className="text-black">
                {id}
              </option>
            ))}
          </select>
          {errors.id_type && (
            <span className="italic text-red-400/90 text-xs">
              {errors.id_type.message}
            </span>
          )}
        </div>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <UploadCard
          title="Upload Front Side"
          subtitle="Clear photo of the front — PNG, JPG"
          type="id_front"
        />

        <UploadCard
          title="Upload Back Side"
          subtitle="Clear photo of the back — PNG, JPG"
          type="id_back"
        />
      </div>

      {/* Selfie Text */}
      <p className="mt-6 text-xs text-gray-500">
        Upload a clear selfie for identity matching.{" "}
        <span className="text-red-600">*</span>
      </p>

      {/* Selfie Upload */}
      <div className="mt-5 flex justify-center">
        <div className="w-full md:w-[420px]">
          <UploadCard
            title="Upload Selfie Photo"
            subtitle="Make sure face is clearly visible"
            type="selfie"
          />
        </div>
      </div>
    </div>
  );
};

const UploadCard = ({ title, subtitle, type }) => {
  
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const uploadMessage = {
    selfie: "your selfie",
    id_back: "the back side of document",
    id_front: "the front side of document",
  };
  
  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50/40 p-6 text-center hover:border-green-800 hover:bg-green-50/30">
        <input
          type="file"
          className="hidden"
          {...register(type, {
            required: `Please upload ${uploadMessage[type]}`,
            })}
        />

        <div className=" mb-6 flex h-10 w-10 items-center justify-center rounded-2xl">
          <Upload className="h-5 w-5 text-green-600" />
        </div>

        <h3 className="text-sm font-semibold text-gray-900">
          {title}
          <span className="text-red-500">*</span>
        </h3>

        <p className="mt-2 text-xs text-gray-400">{subtitle}</p>
      </label>
      <div className="mt-1">
        {errors[type] && (
          <span className="italic text-red-400/90 text-xs">{errors[type].message}</span>
        )}
      </div>
    </div>
  );
};

export default IdentityVerification;
