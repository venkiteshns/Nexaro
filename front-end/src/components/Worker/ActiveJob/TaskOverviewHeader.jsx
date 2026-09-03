import { Tag, MapPin, Clock } from 'lucide-react';

export default function TaskOverviewHeader({ mainData, bid }) {
    return (
        <div>
            <p className="text-xs font-bold text-[#0A6E5C] uppercase tracking-widest mb-1">
                Task Overview
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {mainData?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
                {mainData?.category && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Tag size={12} />
                        {mainData.category}
                    </span>
                )}
                {mainData?.address?.city && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        {mainData.address.city}
                    </span>
                )}
                {bid?.eta && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        ETA: {bid.eta}
                    </span>
                )}
            </div>
        </div>
    );
}
