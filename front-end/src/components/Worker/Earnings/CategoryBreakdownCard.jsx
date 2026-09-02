import { PieChart } from "lucide-react";

export default function CategoryBreakdownCard({
  categories = [
    { name: "Plumbing", percentage: 65, color: "from-[#0A6E5C] to-emerald-400" },
    { name: "Electrical", percentage: 22, color: "from-teal-600 to-teal-400" },
    { name: "Painting", percentage: 13, color: "from-emerald-700 to-[#0A6E5C]" },
  ],
}) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-gray-100 mb-5">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Breakdown by Category</h3>
          <p className="text-xs text-gray-500 mt-0.5">Earnings share across trade skills</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0A6E5C] flex items-center justify-center">
          <PieChart size={16} />
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span>{cat.name}</span>
              <span className="text-[#0A6E5C] font-extrabold">{cat.percentage}%</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2.5 bg-[#F6FAF8] border border-gray-100 rounded-full overflow-hidden p-0.5">
              <div
                style={{ width: `${cat.percentage}%` }}
                className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
