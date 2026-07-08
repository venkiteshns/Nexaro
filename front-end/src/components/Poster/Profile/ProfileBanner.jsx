import { MapPin, ClipboardList, Edit3, ArrowLeftRight, BadgeCheck } from "lucide-react";

const ProfileBanner = ({ posterInfo, onEditClick }) => (
  <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
    {/* Mobile layout */}
    <div className="block min-[668px]:hidden">
      <div className="h-auto bg-linear-to-br from-[#0A6E5C] via-emerald-500 to-teal-400 relative overflow-hidden rounded-t-2xl px-5 py-5">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-3 right-8 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute -bottom-6 left-10 w-24 h-24 rounded-full bg-white/20 blur-xl" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shrink-0">
            {posterInfo?.selfie ? (
              <img
                src={posterInfo.selfie}
                className="w-full h-full object-cover rounded-full"
                alt=""
              />
            ) : posterInfo?.name ? (
              posterInfo.name.charAt(0).toUpperCase()
            ) : (
              "R"
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-extrabold text-white">
                {posterInfo?.name || "Rahul Sharma"}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wide border border-white/30">
                <BadgeCheck size={10} /> VERIFIED
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-white/80">
                <ClipboardList size={11} /> Task Poster
              </span>
              {posterInfo.city && (
                <span className="flex items-center gap-1 text-xs text-white/80">
                  <MapPin size={11} /> {posterInfo.city}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 px-5 py-4">
        <button
          onClick={onEditClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#0A6E5C] text-[#0A6E5C] bg-white text-xs font-semibold hover:bg-emerald-50 transition-all shadow-sm"
        >
          <Edit3 size={12} /> Edit Profile
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 bg-white text-xs font-semibold hover:bg-gray-50 transition-all shadow-sm">
          <ArrowLeftRight size={12} /> Switch to Worker
        </button>
      </div>
    </div>

    {/* Desktop layout */}
    <div className="hidden min-[668px]:block">
      <div className="h-28 bg-linear-to-br from-[#0A6E5C] via-emerald-500 to-teal-400 relative overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-3 right-8 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute -bottom-6 left-10 w-24 h-24 rounded-full bg-white/20 blur-xl" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>
      <div className="px-6 pb-6 relative z-10">
        <div className="flex flex-row justify-between gap-4 -mt-16 mb-4">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-emerald-400 to-[#0A6E5C] flex items-center justify-center text-white font-extrabold text-3xl border-4 border-white shadow-lg shrink-0">
              {posterInfo?.selfie ? (
                <img
                  src={posterInfo.selfie}
                  className="w-full h-full object-cover rounded-full"
                  alt=""
                />
              ) : posterInfo?.name ? (
                posterInfo.name.charAt(0).toUpperCase()
              ) : (
                "R"
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-gray-100">
                  {posterInfo?.name || "Rahul Sharma"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#0A6E5C] text-[10px] font-bold tracking-wide border border-emerald-200">
                  <BadgeCheck size={11} /> VERIFIED
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <ClipboardList size={12} /> Task Poster
                </span>
                {posterInfo.city && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} /> {posterInfo.city}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0 self-end pt-8">
            <button
              onClick={onEditClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#0A6E5C] text-[#0A6E5C] bg-white text-sm font-semibold hover:bg-emerald-50 transition-all shadow-sm"
            >
              <Edit3 size={14} /> Edit Profile
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 bg-white text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
              <ArrowLeftRight size={14} /> Switch to Worker
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileBanner;
