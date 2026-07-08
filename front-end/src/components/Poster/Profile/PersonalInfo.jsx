import { Mail, Phone } from "lucide-react";

const PersonalInfo = ({ posterInfo }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h2 className="text-base font-bold text-gray-900 mb-5">
      Personal Information
    </h2>
    <div className="grid grid-cols-2 gap-y-5">
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
          Full Name
        </p>
        <p className="text-sm font-semibold text-gray-800">
          {posterInfo?.name || "—"}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
          City
        </p>
        <p className="text-sm font-semibold text-gray-800">
          {posterInfo.city || "—"}
        </p>
      </div>
      <div className="col-span-2">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
          Email Address
        </p>
        <div className="flex items-center gap-2">
          <Mail size={13} className="text-[#0A6E5C]" />
          <p className="text-sm font-semibold text-gray-800">
            {posterInfo?.email || "—"}
          </p>
        </div>
      </div>
      <div className="col-span-2">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
          Phone Number
        </p>
        <div className="flex items-center gap-2">
          <Phone size={13} className="text-[#0A6E5C]" />
          <p className="text-sm font-semibold text-gray-800">
            {posterInfo.phone || "—"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default PersonalInfo;
