import TaskHeaderBanner from './TaskHeaderBanner';
import TaskSummaryCard from './TaskSummaryCard';
import FinalInvoiceCard from './FinalInvoiceCard';
import ReviewCard from './ReviewCard';

export default function CompletedTaskContent({
    task,
    worker,
    poster,
    invoice,
    review,
    isWorker = false,
    showInvoice = isWorker,
    headerProps = {},
    reviewProps = {},
    className = "",
}) {
    return (
        <div className={`p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4 ${className}`}>
            {/* Header */}
            <TaskHeaderBanner title={task?.title} {...headerProps} />

            {/* Task overview + Worker/Poster profile */}
            <TaskSummaryCard
                task={task}
                worker={worker}
                poster={poster}
            />

            {/* Invoice + Review for worker, or just Review for poster */}
            {showInvoice && invoice ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FinalInvoiceCard invoice={invoice} isWorker={isWorker} />
                    <ReviewCard review={review} {...reviewProps} />
                </div>
            ) : (
                <ReviewCard review={review} {...reviewProps} />
            )}
        </div>
    );
}
