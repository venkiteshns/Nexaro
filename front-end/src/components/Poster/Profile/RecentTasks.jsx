import { categoryIcon, statusColor } from "./profileUtils.jsx";

const RecentTasks = ({ recentTasks, isLoading }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-3.5 sm:p-4">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold text-gray-900">Recent Tasks</h2>
      <a
        href="/poster/my-tasks"
        className="text-xs font-semibold text-[#0A6E5C] hover:underline"
      >
        View All
      </a>
    </div>

    {isLoading && (
      <div className="space-y-2 py-1 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-gray-50 last:border-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-gray-100 rounded w-2/3" />
              <div className="h-2.5 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )}

    {!isLoading && recentTasks.length === 0 && (
      <p className="text-xs text-gray-400 text-center py-6">
        No tasks posted yet.
      </p>
    )}

    {!isLoading &&
      recentTasks.map((task) => (
        <div
          key={task._id}
          className="flex items-center py-2 border-b border-gray-50 last:border-0 group hover:bg-gray-50/60 rounded-lg px-2 -mx-2 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0A6E5C] shrink-0 text-xs">
              {categoryIcon(task.category)}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 leading-tight">
                {task.title}
              </p>
              <span
                className={`inline-block text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded-full mt-0.5 ${statusColor(task.status)}`}
              >
                {task.status?.replace("_", " ").toUpperCase()}
                {task.amount
                  ? ` · ₹${Number(task.amount).toLocaleString("en-IN")}`
                  : ""}
              </span>
            </div>
          </div>
        </div>
      ))}
  </div>
);

export default RecentTasks;
