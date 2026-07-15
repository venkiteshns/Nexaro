import { Camera, Eye, MapPin, Tag, Zap } from 'lucide-react'

const RightSideBar = ({ title, location, budget }) => {
    return (
        <div className=" hidden xl:block space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm sticky top-0">
                <div className="flex items-center gap-2 mb-3">
                    <Eye size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                        Live Preview
                    </span>
                    <div className="ml-auto flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-[#0A6E5C]" />
                    </div>
                </div>

                {/* card */}
                <div className="bg-[#F6FAF8] rounded-xl p-4 border border-gray-100">
                    <span className="inline-block text-[10px] font-bold text-[#0A6E5C] bg-emerald-100 rounded-full px-2.5 py-0.5 mb-2">
                        NEW LISTING
                    </span>
                    <h3 className="text-[#111827] font-bold text-base leading-snug mb-2">
                        {/* test title */}
                        {title || "Add Title"}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                        <div className="flex items-center gap-1">
                            <Tag size={11} className="text-[#0A6E5C]" />
                            <span className="text-[#0A6E5C] font-bold text-sm">
                                {/* budget 200 */}
                                {budget || "Add Budget"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin size={11} />
                            {/* kochi */}
                            {location || "Add Location"}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-4 rounded-full bg-gray-200" />
                        <div className="w-6 h-6 rounded-full bg-gray-200" />
                        <span className="text-[10px] text-gray-400 ml-auto">
                            Nearby workers active
                        </span>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-600 mb-3">
                        Tips for Better Bids
                    </p>
                    <div className="space-y-3">
                        {[
                            {
                                icon: <Zap size={12} className="text-[#0A6E5C]" />,
                                title: "Be Specific",
                                desc: "Detailed descriptions attract 40% more qualified professionals.",
                            },
                            {
                                icon: <Camera size={12} className="text-[#0A6E5C]" />,
                                title: "Visual Context",
                                desc: "Tasks with photos receive bids 2× faster than text-only tasks.",
                            },
                            {
                                icon: <Tag size={12} className="text-[#0A6E5C]" />,
                                title: "Fair Pricing",
                                desc: "Check local rates to ensure your budget is competitive.",
                            },
                        ].map((tip, i) => (
                            <div key={i} className="flex gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                    {tip.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-700">
                                        {tip.title}
                                    </p>
                                    <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                                        {tip.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightSideBar