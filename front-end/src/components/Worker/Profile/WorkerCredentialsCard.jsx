import { ShieldCheck, Phone, MapPin, CheckCircle, TriangleAlert, Clock } from 'lucide-react';

const CredentialRow = ({ icon, label, detail, verified }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${verified ? 'bg-emerald-50' : 'bg-gray-50'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-semibold text-gray-900">{label}</p>
            {detail && <p className="text-xs text-gray-400 mt-0.5 truncate">{detail}</p>}
        </div>
        {verified && (
            <CheckCircle size={13} className="text-[#0A6E5C] shrink-0 mt-0.5 md:w-4 md:h-4" />
        )}
    </div>
);

/**
 * WorkerCredentialsCard
 * Props: credentials { identityVerified, email, phone, address }
 */
const WorkerCredentialsCard = ({ credentials }) => {
    const email = credentials?.email || 'id****@gmail.com';
    const phone = credentials?.phone || '+91••••••1234';
    const address = credentials?.address || 'Indiranagar, Bengaluru — 560038';
    const isVerified = credentials.isVerified || false;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-xl ${isVerified ? "bg-emerald-50" : "bg-amber-100"} flex items-center justify-center`}>
                    {isVerified ? <ShieldCheck size={13} className="text-[#0A6E5C] md:w-4 md:h-4" /> : <TriangleAlert size={13} className='text-amber-700 md:w-4 md:h-4' />}
                </div>
                <h2 className="font-extrabold text-gray-900 text-sm md:text-base">{isVerified ? "Verified Credentials" : <> Credentials <span className="ms-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-amber-100/80 text-amber-700 border border-amber-200 shadow-sm">
                    Verification Pending
                </span> </>}</h2>
            </div>

            <div className="mt-2">
                <CredentialRow
                    icon={<ShieldCheck size={12} className="text-[#0A6E5C] md:w-[15px] md:h-[15px]" />}
                    label={isVerified ? "Identity Verified" : "Email"}
                    detail={email}
                    isVerified
                />
                <CredentialRow
                    icon={<Phone size={12} className="text-[#0A6E5C] md:w-[15px] md:h-[15px]" />}
                    label="Phone"
                    detail={phone}
                    isVerified
                />
                <CredentialRow
                    icon={<MapPin size={12} className="text-[#0A6E5C] md:w-[15px] md:h-[15px]" />}
                    label="Location"
                    detail={address}
                    isVerified
                />
            </div>
        </div>
    );
};

export default WorkerCredentialsCard;
