import { Calendar } from "lucide-react";
import SelectDropdown from "../../../../sharedComponents/SelectDropdown";

export default function PlMonthFilter({
  monthOptions,
  selectedMonthValue,
  onMonthChange,
}) {
  return (
    <div className="w-full">
      <SelectDropdown
        options={monthOptions}
        value={selectedMonthValue}
        onChange={onMonthChange}
        icon={Calendar}
        className="w-full"
        buttonClassName="w-full justify-between py-2.5 bg-[#F8FBFA] border-gray-200 text-xs sm:text-sm"
        menuClassName="w-full"
        align="left"
      />
    </div>
  );
}
