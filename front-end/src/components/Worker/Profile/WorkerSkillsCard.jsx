import { Wrench } from 'lucide-react';

const WorkerSkillsCard = ({ skills }) => {
    const list = skills?.length ? skills : ['Plumbing', 'Electrician', 'HVAC Repair'];

    return (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs p-3.5 sm:p-4 h-full">
            <div className="flex items-center gap-1.5 mb-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Wrench size={12} className="text-[#0A6E5C]" />
                </div>
                <h2 className="font-bold text-gray-900 text-xs sm:text-sm">Skills &amp; Expertise</h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {list.map((skill) => (
                    <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#0A6E5C]"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default WorkerSkillsCard;
