import { Image } from "lucide-react";

export function PhotoStrip({ photos = [] }) {
  return (
    <div className="overflow-x-auto mt-4 pb-1">
      <div className="flex gap-3 w-max">
        {photos.map((img, i) => (
          <div
            key={i}
            className="relative h-24 w-28 rounded-xl overflow-hidden shrink-0 bg-gray-100"
          >
            <img
              src={img?.url}
              alt={`task-photo-${i}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {photos.length === 0 && (
          <div className="relative h-24 w-28 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            <Image className="text-gray-400" size={24} />
            <div className="absolute bottom-0 left-0 w-full bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-bold">No Photos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}