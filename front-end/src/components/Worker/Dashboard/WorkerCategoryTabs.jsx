import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkerCategoryTabs = ({
  categories = ["All", "Electrician", "Plumber", "Painter", "Tutor"],
  activeCategory = "All",
  onSelectCategory,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isSelected =
            (cat === "All" && (!activeCategory || activeCategory.toLowerCase() === "all")) ||
            cat.toLowerCase() === activeCategory?.toLowerCase();

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#0A6E5C] text-white shadow-xs font-bold"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-[#0A6E5C] hover:bg-emerald-50/50"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* View More Link */}
      <button
        onClick={() => navigate("/worker/nearby-tasks")}
        className="self-end sm:self-auto text-xs font-bold text-[#0A6E5C] hover:text-emerald-700 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
      >
        <span>View More</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
};

export default WorkerCategoryTabs;
