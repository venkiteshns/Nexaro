export default function PageLoader({ title, text = "Loading task details…" }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20">
            <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0A6E5C] animate-spin" />
            </div>
            <div className="text-center">
                {title && <p className="text-base font-extrabold text-gray-900 mb-1">{title}</p>}
                <p className="text-sm text-gray-400 font-medium">{text}</p>
            </div>
        </div>
    );
}
