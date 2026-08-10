import { Wrench } from 'lucide-react';

/**
 * WorkerSkillsCard
 * Props: skills: string[]
 */
const WorkerSkillsCard = ({ skills }) => {
    const list = skills?.length ? skills : ['Plumbing', 'Electrician', 'HVAC Repair'];

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Wrench size={13} className="text-[#0A6E5C] md:w-4 md:h-4" />
                </div>
                <h2 className="font-extrabold text-gray-900 text-sm md:text-base">Skills &amp; Expertise</h2>
            </div>

            <div className="flex flex-wrap gap-2">
                {list.map((skill) => (
                    <span
                        key={skill}
                        className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs md:text-sm font-semibold text-[#0A6E5C]"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default WorkerSkillsCard;
