import { ArrowRight, CheckCircle2, Star, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkerCompletedTasks = ({ completedTasks = [] }) => {
  const navigate = useNavigate();
  const displayedTasks = completedTasks.slice(0, 3);

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Completed Tasks
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Recently finished jobs</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/worker/earnings")}
          className="text-xs font-bold text-[#0A6E5C] hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Completed Tasks List */}
      {displayedTasks.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 text-center shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0A6E5C] flex items-center justify-center mx-auto mb-2">
            <Award size={18} />
          </div>
          <h4 className="text-xs font-bold text-gray-800 mb-0.5">No Completed Tasks Yet</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Tasks you complete and receive payments for will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayedTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => {
                if (task._id) {
                  navigate(`/worker/completed-task/${task._id}`);
                }
              }}
              className="group bg-white border border-gray-200/80 hover:border-emerald-300 rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
            >
              {/* Top Row: Title + Completed Badge */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0A6E5C] transition-colors line-clamp-1">
                  {task.title || "Completed Task"}
                </h4>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#0A6E5C] shrink-0 border border-emerald-200/60">
                  <CheckCircle2 size={11} className="text-[#0A6E5C]" />
                  <span>Done</span>
                </span>
              </div>

              {/* Bottom Row: Category / Rating + Amount */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {task.category && (
                    <span className="text-[11px] text-gray-500 font-medium">
                      {task.category}
                    </span>
                  )}
                  {task.rating ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>{Number(task.rating).toFixed(1)}</span>
                    </span>
                  ) : null}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    EARNED
                  </span>
                  <span className="text-sm sm:text-base font-black text-gray-900">
                    ₹{Number(task.amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default WorkerCompletedTasks;
