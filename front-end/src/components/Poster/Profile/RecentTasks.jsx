import { ChevronRight, Loader } from "lucide-react";
import { categoryIcon, statusColor } from "./profileUtils.jsx";

const RecentTasks = ({ recentTasks, isLoading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-base font-bold text-gray-900">Recent Tasks</h2>
      <a
        href="/poster/my-tasks"
        className="text-xs font-semibold text-[#0A6E5C] hover:underline"
      >
        View All
      </a>
    </div>

    {isLoading && (
      <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
        <Loader size={16} className="animate-spin mr-2" /> Loading...
      </div>
    )}

    {!isLoading && recentTasks.length === 0 && (
      <p className="text-sm text-gray-400 text-center py-8">
        No tasks posted yet.
      </p>
    )}

    {!isLoading &&
      recentTasks.map((task) => (
        <div
          key={task._id}
          className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 group hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0A6E5C] shrink-0">
              {categoryIcon(task.category)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {task.title}
              </p>
              <span
                className={`inline-block text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full mt-0.5 ${statusColor(task.status)}`}
              >
                {task.status?.replace("_", " ").toUpperCase()}
                {task.amount
                  ? ` · ₹${Number(task.amount).toLocaleString("en-IN")}`
                  : ""}
              </span>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-gray-300 group-hover:text-[#0A6E5C] transition-colors"
          />
        </div>
      ))}
  </div>
);

export default RecentTasks;
