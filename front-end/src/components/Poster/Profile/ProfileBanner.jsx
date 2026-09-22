import { MapPin, ClipboardList, Edit3, ArrowLeftRight, BadgeCheck, Clock } from "lucide-react";

const ProfileBanner = ({ posterInfo, isLoading, onEditClick, onRoleSwitch }) => {
  if (isLoading) {
    return (
      <div className="relative bg-white rounded-xl border border-gray-100 shadow-xs mb-4 overflow-hidden animate-pulse">
        {/* Banner shimmer */}
        <div className="h-20 bg-linear-to-br from-[#0A6E5C]/60 via-emerald-500/50 to-teal-400/40" />
        <div className="px-4 pb-3.5 relative z-10">
          <div className="flex flex-row justify-between gap-3 -mt-10 mb-1">
            <div className="flex items-end gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 border-3 border-white shadow-sm shrink-0" />
              <div className="space-y-1.5 pb-1">
                <div className="h-4 sm:h-5 w-32 sm:w-40 bg-white/40 rounded-md" />
                <div className="h-3 w-20 bg-gray-200 rounded-md" />
              </div>
            </div>
            <div className="flex gap-2 shrink-0 self-end pt-4">
              <div className="h-7 w-20 sm:w-24 bg-gray-200 rounded-lg" />
              <div className="h-7 w-24 sm:w-28 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initial = posterInfo?.name ? posterInfo.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative bg-white rounded-xl border border-gray-100 shadow-xs mb-4">
      {/* Mobile layout */}
      <div className="block min-[668px]:hidden">
        <div className="h-auto bg-linear-to-br from-[#0A6E5C] via-emerald-500 to-teal-400 relative overflow-hidden rounded-t-xl px-4 py-3.5">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-6 w-24 h-24 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute -bottom-4 left-8 w-20 h-20 rounded-full bg-white/20 blur-xl" />
          </div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
              {posterInfo?.selfie ? (
                <img
                  src={posterInfo.selfie}
                  className="w-full h-full object-cover rounded-full"
                  alt=""
                />
              ) : (
                initial
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm font-extrabold text-white">
                  {posterInfo?.name || "Task Poster"}
                </h1>
                {posterInfo?.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-bold tracking-wide border border-white/30">
                    <BadgeCheck size={9} /> VERIFIED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-white text-[9px] font-bold tracking-wide border border-amber-300/40">
                    <Clock size={9} /> PENDING
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] text-white/80">
                  <ClipboardList size={10} /> Task Poster
                </span>
                {posterInfo?.city && (
                  <span className="flex items-center gap-1 text-[11px] text-white/80">
                    <MapPin size={10} /> {posterInfo.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-4 py-2.5">
          <button
            onClick={onEditClick}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#0A6E5C] text-[#0A6E5C] bg-white text-xs font-semibold hover:bg-emerald-50 transition-all shadow-xs cursor-pointer"
          >
            <Edit3 size={11} /> Edit Profile
          </button>
          <button
            onClick={onRoleSwitch}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 bg-white text-xs font-semibold hover:bg-gray-50 transition-all shadow-xs cursor-pointer">
            <ArrowLeftRight size={11} /> Switch to Worker
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden min-[668px]:block">
        <div className="h-20 bg-linear-to-br from-[#0A6E5C] via-emerald-500 to-teal-400 relative overflow-hidden rounded-t-xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-6 w-24 h-24 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute -bottom-4 left-8 w-20 h-20 rounded-full bg-white/20 blur-xl" />
          </div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
        </div>
        <div className="px-4 pb-3.5 relative z-10">
          <div className="flex flex-row justify-between gap-3 -mt-10 mb-1">
            <div className="flex items-end gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-emerald-400 to-[#0A6E5C] flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl border-3 border-white shadow-md shrink-0">
                {posterInfo?.selfie ? (
                  <img
                    src={posterInfo.selfie}
                    className="w-full h-full object-cover rounded-full"
                    alt=""
                  />
                ) : (
                  initial
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-extrabold text-white">
                    {posterInfo?.name || "Task Poster"}
                  </h1>
                  {posterInfo?.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white text-[#0A6E5C] text-[9px] font-bold tracking-wide border border-emerald-100 shadow-2xs">
                      <BadgeCheck size={10} /> VERIFIED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold tracking-wide border border-amber-200 shadow-2xs">
                      <Clock size={10} /> PENDING
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] text-gray-500">
                    <ClipboardList size={11} /> Task Poster
                  </span>
                  {posterInfo?.city && (
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                      <MapPin size={11} /> {posterInfo.city}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 self-end pt-4">
              <button
                onClick={onEditClick}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#0A6E5C] text-[#0A6E5C] bg-white text-xs font-semibold hover:bg-emerald-50 transition-all shadow-xs cursor-pointer"
              >
                <Edit3 size={12} /> Edit Profile
              </button>
              <button
                onClick={onRoleSwitch}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 bg-white text-xs font-semibold hover:bg-gray-50 transition-all shadow-xs cursor-pointer">
                <ArrowLeftRight size={12} /> Switch to Worker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
