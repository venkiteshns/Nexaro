import React from "react";

const DEFAULT_OPTIONS = [
  { label: "7 Days", shortLabel: "7D", value: "7D" },
  { label: "1 Month", shortLabel: "1M", value: "1M" },
  { label: "6 Months", shortLabel: "6M", value: "6M" },
  { label: "1 Year", shortLabel: "1Y", value: "1Y" },
];

export default function TimeframeSelector({
  selectedTimeframe = "7D",
  onChange,
  options = DEFAULT_OPTIONS,
  disabled = false,
}) {
  return (
    <div className="flex items-center p-1 bg-[#F6FAF8] border border-emerald-100/80 rounded-2xl self-start sm:self-auto">
      {options.map((option) => {
        const isSelected = selectedTimeframe === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange && onChange(option.value)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelected
                ? "bg-[#0A6E5C] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-emerald-50/50"
            }`}
          >
            <span className="hidden sm:inline">{option.label}</span>
            <span className="inline sm:hidden">{option.shortLabel || option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
