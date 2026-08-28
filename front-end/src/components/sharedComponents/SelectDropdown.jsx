import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * Helper to render an icon whether it's a Component (function / forwardRef) or JSX element
 */
function renderIcon(iconProp, defaultClass = "text-[#0A6E5C] shrink-0", size = 16) {
  if (!iconProp) return null;
  if (React.isValidElement(iconProp)) {
    return iconProp;
  }
  const IconComponent = iconProp;
  return <IconComponent size={size} className={defaultClass} />;
}

/**
 * Reusable SelectDropdown Component
 * 
 * Supports:
 * - Simple array of strings (e.g. ["Today", "Last 30 Days"])
 * - Array of objects (e.g. [{ label: "Last 30 Days", value: "30d", icon: Calendar }])
 * - Left icon slot (Lucide icon component or JSX)
 * - Click outside detection
 * - Customizable alignment, styling, and checkmark indicators
 */
export default function SelectDropdown({
  options = [],
  value,
  onChange,
  icon,
  placeholder = "Select option",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  align = "right",
  disabled = false,
  showCheckmark = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format options to a standard shape: { label, value, icon }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return {
        label: opt.label ?? String(opt.value),
        value: opt.value ?? opt.label,
        icon: opt.icon,
      };
    }
    return {
      label: String(opt),
      value: opt,
      icon: null,
    };
  });

  // Determine current display label and icon
  const currentOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = currentOption ? currentOption.label : value || placeholder;

  const handleSelect = (option) => {
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#0A6E5C] hover:border-emerald-300 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? "border-emerald-400 ring-2 ring-emerald-500/10 text-[#0A6E5C]" : ""
        } ${buttonClassName}`}
      >
        {/* Left Icon */}
        {renderIcon(icon, "text-[#0A6E5C] shrink-0", 16)}

        {/* Current option icon if defined */}
        {currentOption?.icon && renderIcon(currentOption.icon, "text-[#0A6E5C] shrink-0", 16)}

        <span className="truncate">{displayLabel}</span>

        <ChevronDown
          size={15}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#0A6E5C]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "left" ? "left-0" : "right-0"
          } mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-30 py-1.5 animate-[fadeIn_.15s_ease] overflow-hidden ${menuClassName}`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;

            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                  isSelected
                    ? "bg-emerald-50 text-[#0A6E5C]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {opt.icon && renderIcon(opt.icon, isSelected ? "text-[#0A6E5C] shrink-0" : "text-gray-400 shrink-0", 14)}
                  <span className="truncate">{opt.label}</span>
                </div>

                {showCheckmark && isSelected && (
                  <Check size={14} className="text-[#0A6E5C] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
