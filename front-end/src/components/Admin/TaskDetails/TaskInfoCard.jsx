import { Calendar, Clock, Tag, AlertTriangle, DollarSign, Layers } from 'lucide-react';

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words">{value}</p>
            </div>
        </div>
    );
}

const urgencyColors = {
    urgent: 'bg-red-50 text-red-600 border-red-200',
    normal: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    flexible: 'bg-green-50 text-green-700 border-green-200',
};

const TaskInfoCard = ({ task }) => {
    const deadline = task.deadline
        ? new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';
    const createdAt = task.createdAt
        ? new Date(task.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';
    const urgency = task.urgencyLevel || 'normal';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <p className="font-extrabold text-gray-900 text-base mb-2">Task Information</p>

            {/* Description */}
            {task.description && (
                <p className="text-sm text-gray-500 leading-relaxed mb-4 border-l-2 border-emerald-200 pl-3">
                    {task.description}
                </p>
            )}

            <InfoRow icon={<Tag size={14} className="text-[#0A6E5C]" />} label="Category" value={task.category} />
            <InfoRow icon={<DollarSign size={14} className="text-[#0A6E5C]" />} label="Budget" value={`₹${Number(task.amount || 0).toLocaleString('en-IN')}`} />
            <InfoRow icon={<Calendar size={14} className="text-gray-400" />} label="Deadline" value={deadline} />
            <InfoRow icon={<Clock size={14} className="text-gray-400" />} label="Created On" value={createdAt} />
            <InfoRow
                icon={<Layers size={14} className="text-gray-400" />}
                label="Address"
                value={[task.address?.area, task.address?.city, task.address?.district, task.address?.state].filter(Boolean).join(', ')}
            />

            {/* Urgency badge */}
            <div className="flex items-center gap-3 pt-3 mt-1">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <AlertTriangle size={14} className="text-gray-400" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Urgency</p>
                    <span className={`mt-0.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${urgencyColors[urgency]}`}>
                        {urgency}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TaskInfoCard;
