import { ShieldCheck, Phone, MapPin, CheckCircle, TriangleAlert } from 'lucide-react';

const CredentialRow = ({ icon, label, detail, verified }) => (
    <div className="flex items-start gap-2.5 py-2 border-b border-gray-100 last:border-0">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${verified ? 'bg-emerald-50' : 'bg-gray-50'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900">{label}</p>
            {detail && <p className="text-[11px] text-gray-400 mt-0.5 truncate">{detail}</p>}
        </div>
        {verified && (
            <CheckCircle size={12} className="text-[#0A6E5C] shrink-0 mt-0.5" />
        )}
    </div>
);

const WorkerCredentialsCard = ({ credentials }) => {
    const email = credentials?.email || 'id****@gmail.com';
    const phone = credentials?.phone || '+91••••••1234';
    const address = credentials?.address || 'Indiranagar, Bengaluru — 560038';
    const isVerified = credentials.isVerified || false;

    return (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-6 h-6 rounded-lg ${isVerified ? "bg-emerald-50" : "bg-amber-100"} flex items-center justify-center`}>
                    {isVerified ? <ShieldCheck size={12} className="text-[#0A6E5C]" /> : <TriangleAlert size={12} className='text-amber-700' />}
                </div>
                <h2 className="font-bold text-gray-900 text-xs sm:text-sm">{isVerified ? "Verified Credentials" : <> Credentials <span className="ms-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100/80 text-amber-700 border border-amber-200 shadow-2xs">
                    Verification Pending
                </span> </>}</h2>
            </div>

            <div className="mt-1">
                <CredentialRow
                    icon={<ShieldCheck size={12} className="text-[#0A6E5C]" />}
                    label={isVerified ? "Identity Verified" : "Email"}
                    detail={email}
                    verified
                />
                <CredentialRow
                    icon={<Phone size={12} className="text-[#0A6E5C]" />}
                    label="Phone"
                    detail={phone}
                    verified
                />
                <CredentialRow
                    icon={<MapPin size={12} className="text-[#0A6E5C]" />}
                    label="Location"
                    detail={address}
                    verified
                />
            </div>
        </div>
    );
};

export default WorkerCredentialsCard;
