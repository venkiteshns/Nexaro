import React, { useEffect } from "react";
import {SKILLS, LANGUAGES} from '../../utils/constants'
import { useFormContext } from "react-hook-form";


const CustomSelector = ( props ) => {
  const section = props.section;

  const DATA = section === 'skill' ? SKILLS : LANGUAGES;

  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    register(`${section}`, {
      validate: (v) => v?.length > 0 || `Please select at least one ${section}`,
    });
  }, [register, section]);

  const selected = watch(section) ?? [];

  const toggle = (item) => {
    const updated = selected.includes(item)
      ? selected.filter((l) => l !== item)
      : [...selected, item];
    setValue(section, updated, { shouldValidate: true });
  };

  return (
    <div className="mt-5 ">
      <label className="text-xs text-gray-600/70">
        {section === 'skill' ? "Select your elite skills" : "Select Languages you are comfortable to communicate"} <span className="text-red-600">*</span>
      </label>
      <div className="mt-1 w-full rounded-3xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {DATA.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => toggle(item)}
              className={`
              px-5 py-2 text-sm rounded-full border
              ${
                selected.includes(item)
                  ? "bg-[#0a6e5c] text-white border-[#0a6e5c]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }
            `}
            >
              {item}
            </button>
          ))}
        </div>
        {errors[`${section}`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${section}`].message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomSelector;
