import { ArrowRight, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkerProposalSidebar = ({ proposals = [] }) => {
  const navigate = useNavigate();

  const displayedProposals = proposals.slice(0, 3);

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Status of your proposals
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Recent bids placed</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/worker/my-bids")}
          className="text-xs font-bold text-[#0A6E5C] hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>View all Bids</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Proposals List */}
      {displayedProposals.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 text-center shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0A6E5C] flex items-center justify-center mx-auto mb-2">
            <Briefcase size={18} />
          </div>
          <h4 className="text-xs font-bold text-gray-800 mb-0.5">No Proposals Yet</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            You haven't placed any bids yet. Bid on open tasks to start winning jobs!
          </p>
          <button
            onClick={() => navigate("/worker/nearby-tasks")}
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-50 text-[#0A6E5C] hover:bg-emerald-100 font-bold text-xs transition-colors cursor-pointer"
          >
            Explore Available Tasks
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {displayedProposals.map((proposal) => (
            <div
              key={proposal._id}
              onClick={() => {
                if (proposal._id) {
                  navigate(`/worker/task-bid-details/${proposal._id}`);
                } else if (proposal.taskId) {
                  navigate(`/worker/task/${proposal.taskId}`);
                } else {
                  navigate("/worker/my-bids");
                }
              }}
              className="group bg-white border border-gray-200/80 hover:border-emerald-300 rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
            >
              {/* Title */}
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0A6E5C] transition-colors line-clamp-1 mb-1.5">
                {proposal.taskTitle || "Task Proposal"}
              </h4>

              {/* Subtitle / Bid Amount */}
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  YOUR BID
                </span>
                <span className="text-sm sm:text-base font-black text-gray-900">
                  ₹{Number(proposal.bidAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default WorkerProposalSidebar;
