import { useEffect } from "react";
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
    <div data-field={section} id={`field-${section}`} className="mt-3 sm:mt-5 scroll-mt-24">
      <label className="text-[11px] sm:text-xs text-gray-600/70">
        {section === 'skill' ? "Select your elite skills" : "Select Languages you are comfortable to communicate"} <span className="text-red-600">*</span>
      </label>
      <div className="mt-1 w-full rounded-2xl sm:rounded-3xl border border-gray-200 p-3 sm:p-4 shadow-sm">
        <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
          {DATA.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => toggle(item)}
              className={`
              px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm rounded-full border transition-all duration-200 active:scale-95
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
          <p className="italic text-red-400/90 text-xs">
            {errors[`${section}`].message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomSelector;
