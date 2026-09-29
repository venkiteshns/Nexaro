import { useState } from "react";
import {
  Gift,
  Copy,
  Check,
  Share2,
  Users,
  Coins,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGetReferralStatsQuery } from "../../../store/services/referralApi";
import { showSuccess } from "../../../utils/toast";

const ReferAndEarnCard = ({ role = "worker" }) => {
  const { data, isLoading, isError } = useGetReferralStatsQuery();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const referralData = data?.data || {};
  const code = referralData.referralCode || "NEXARO";
  const stats = referralData.stats || {
    totalReferred: 0,
    totalEarnings: 0,
    completedCount: 0,
    pendingCount: 0,
  };
  const referrals = referralData.referrals || [];

  const origin = window.location.origin;
  const sharePath = role === "poster" ? "/signup/poster" : "/signup/worker";
  const inviteLink = `${origin}${sharePath}?ref=${code}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      showSuccess("Referral code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      showSuccess("Invite link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Join me on Nexaro, the trusted hyperlocal marketplace! Sign up using my referral code *${code}* and get ₹50 welcome bonus on your first completed job: ${inviteLink}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-72 bg-gray-100 rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-20 bg-gray-100 rounded-2xl" />
          <div className="h-20 bg-gray-100 rounded-2xl" />
          <div className="h-20 bg-gray-100 rounded-2xl" />
          <div className="h-20 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-white via-[#fafdfb] to-[#f0f9f6] border border-[#0A6E5C]/15 shadow-xs p-3.5 sm:p-4 lg:p-5 relative overflow-hidden">
      {/* Decorative top-right accent */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#0A6E5C]/10 to-emerald-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 relative">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0A6E5C] to-emerald-600 flex items-center justify-center text-white shadow-xs shadow-[#0A6E5C]/20 shrink-0">
            <Gift size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Refer & Earn
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-[#0A6E5C] px-2 py-0.5 rounded-full">
                <Sparkles size={10} /> ₹100 / Friend
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 max-w-xl">
              Earn <span className="font-semibold text-gray-800">₹100</span> in
              your Nexaro wallet when your friend signs up and completes their
              first job. They also get a{" "}
              <span className="font-semibold text-gray-800">₹50</span> welcome
              bonus!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-3 relative">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-2 sm:p-3 shadow-xs">
          <div className="flex items-center gap-1 text-gray-500 mb-0.5">
            <Users size={12} className="text-[#0A6E5C] sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate">
              Invited
            </span>
          </div>
          <p className="text-sm sm:text-lg font-extrabold text-gray-900 truncate">
            {stats.totalReferred}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-2 sm:p-3 shadow-xs">
          <div className="flex items-center gap-1 text-gray-500 mb-0.5">
            <Coins size={12} className="text-amber-500 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate">
              Earned
            </span>
          </div>
          <p className="text-sm sm:text-lg font-extrabold text-emerald-600 truncate">
            ₹{stats.totalEarnings.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-2 sm:p-3 shadow-xs">
          <div className="flex items-center gap-1 text-gray-500 mb-0.5">
            <Clock size={12} className="text-amber-500 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate">
              Pending
            </span>
          </div>
          <p className="text-sm sm:text-lg font-extrabold text-gray-900 truncate">
            {stats.pendingCount}
          </p>
        </div>
      </div>

      {/* Code & Share Hub */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-2.5 sm:p-3.5 shadow-xs relative mb-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          {/* Referral Code Box */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider shrink-0">
              Your Code:
            </span>
            <div className="inline-flex items-center justify-between gap-2 bg-emerald-50/70 border border-emerald-200/60 rounded-lg px-2.5 sm:px-3 py-1">
              <span className="text-xs sm:text-sm font-black tracking-widest text-[#0A6E5C] font-mono select-all">
                {code}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-gray-500 hover:text-[#0A6E5C] transition p-0.5 cursor-pointer"
                title="Copy Referral Code"
              >
                {copiedCode ? (
                  <Check size={13} className="text-emerald-600" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 sm:px-3 py-1.5 rounded-lg transition duration-150 cursor-pointer truncate"
            >
              {copiedLink ? (
                <>
                  <Check size={13} className="text-emerald-600 shrink-0" /> <span className="truncate">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="shrink-0" /> <span className="truncate">Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold bg-[#25D366] hover:bg-[#20ba59] text-white px-2.5 sm:px-3 py-1.5 rounded-lg transition shadow-xs duration-150 cursor-pointer truncate"
            >
              <Share2 size={13} className="shrink-0" /> <span className="truncate">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Referral History Collapsible */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowHistory((prev) => !prev)}
          className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 hover:text-gray-900 py-2 transition"
        >
          <span>
            Invited Friends Activity ({referrals.length})
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#0A6E5C]">
            {showHistory ? "Hide Activity" : "View Activity"}
            {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {showHistory && (
          <div className="mt-2 bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
            {referrals.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-xs">
                No friends invited yet. Share your code to unlock rewards!
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {referrals.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-gray-50/70 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.refereeName}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Joined: {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      {item.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full text-[11px] border border-emerald-200/50">
                          <Check size={12} /> +₹{item.rewardAmount} Credited
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-medium px-2.5 py-1 rounded-full text-[11px] border border-amber-200/50">
                          <Clock size={12} /> Pending First Job
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferAndEarnCard;
