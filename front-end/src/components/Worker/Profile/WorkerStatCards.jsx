import { Briefcase, IndianRupee, Star } from 'lucide-react';

const StatItem = ({ icon, label, value, sub, className = '' }) => (
    <div className={`bg-white border border-gray-200/80 rounded-xl shadow-xs px-3.5 py-2.5 sm:px-4 sm:py-3 ${className}`}>
        <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                {icon}
            </div>
        </div>
        <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-base sm:text-lg md:text-xl font-extrabold text-gray-900 leading-none">
            {value}
            {sub && <span className="text-[11px] sm:text-xs font-semibold text-gray-400 ml-1">{sub}</span>}
        </p>
    </div>
);

const WorkerStatCards = ({ stats }) => (
    <div className="grid grid-cols-2 min-[416px]:flex min-[416px]:flex-wrap gap-2.5 sm:gap-3">
        <StatItem
            icon={<Briefcase size={12} className="text-[#0A6E5C] sm:w-3.5 sm:h-3.5" />}
            label="Jobs Completed"
            value={stats?.jobsCompleted ?? 34}
            className="order-1 min-[416px]:flex-1 min-[416px]:min-w-[120px]"
        />
        <StatItem
            icon={<IndianRupee size={12} className="text-[#0A6E5C] sm:w-3.5 sm:h-3.5" />}
            label="Total Earned"
            value={`₹${stats?.totalEarned ?? '0'}`}
            sub="lifetime"
            className="order-3 col-span-2 min-[416px]:order-none min-[416px]:col-span-1 min-[416px]:flex-1 min-[416px]:min-w-[120px]"
        />
        <StatItem
            icon={<Star size={12} className="text-[#0A6E5C] sm:w-3.5 sm:h-3.5" />}
            label="Rating"
            value={stats?.rating?.toFixed(1) ?? '0'}
            sub="/ 5"
            className="order-2 min-[416px]:order-none min-[416px]:flex-1 min-[416px]:min-w-[120px]"
        />
    </div>
);

export default WorkerStatCards;
