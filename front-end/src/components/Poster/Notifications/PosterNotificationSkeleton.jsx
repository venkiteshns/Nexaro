const PosterNotificationSkeleton = ({ count = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 animate-pulse flex items-start gap-4 shadow-2xs"
        >
          {/* Media Skeleton */}
          <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />

          {/* Content Skeleton */}
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded-md w-1/3" />
              <div className="h-3 bg-gray-100 rounded-md w-14" />
            </div>

            <div className="h-3.5 bg-gray-100 rounded-md w-3/4" />
            <div className="h-3 bg-gray-100 rounded-md w-1/2" />

            <div className="flex items-center gap-2 pt-1">
              <div className="h-8 bg-gray-200 rounded-xl w-24" />
              <div className="h-8 bg-gray-100 rounded-xl w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PosterNotificationSkeleton;
