import { Mail, Phone } from "lucide-react";

const PersonalInfo = ({ posterInfo, isLoading }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-3.5 sm:p-4">
    <h2 className="text-sm font-bold text-gray-900 mb-3">
      Personal Information
    </h2>
    {isLoading ? (
      <div className="grid grid-cols-2 gap-y-3.5 gap-x-3 animate-pulse">
        <div>
          <div className="h-2 w-14 bg-gray-100 rounded mb-1.5" />
          <div className="h-3.5 w-28 bg-gray-100 rounded" />
        </div>
        <div>
          <div className="h-2 w-10 bg-gray-100 rounded mb-1.5" />
          <div className="h-3.5 w-20 bg-gray-100 rounded" />
        </div>
        <div className="col-span-2">
          <div className="h-2 w-20 bg-gray-100 rounded mb-1.5" />
          <div className="h-3.5 w-44 bg-gray-100 rounded" />
        </div>
        <div className="col-span-2">
          <div className="h-2 w-20 bg-gray-100 rounded mb-1.5" />
          <div className="h-3.5 w-32 bg-gray-100 rounded" />
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-y-3 gap-x-2">
        <div>
          <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
            Full Name
          </p>
          <p className="text-xs sm:text-sm font-semibold text-gray-800">
            {posterInfo?.name || "—"}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
            City
          </p>
          <p className="text-xs sm:text-sm font-semibold text-gray-800">
            {posterInfo?.city || "—"}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
            Email Address
          </p>
          <div className="flex items-center gap-1.5">
            <Mail size={12} className="text-[#0A6E5C] shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
              {posterInfo?.email || "—"}
            </p>
          </div>
        </div>
        <div className="col-span-2">
          <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
            Phone Number
          </p>
          <div className="flex items-center gap-1.5">
            <Phone size={12} className="text-[#0A6E5C] shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              {posterInfo?.phone || "—"}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default PersonalInfo;
