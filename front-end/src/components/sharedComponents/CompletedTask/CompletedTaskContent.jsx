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
        <div className={`p-3 sm:p-5 lg:p-6 w-full space-y-3 sm:space-y-3.5 pb-8 ${className}`}>
            <TaskHeaderBanner title={task?.title} {...headerProps} />

            <TaskSummaryCard
                task={task}
                worker={worker}
                poster={poster}
            />

            {showInvoice && invoice ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                    <FinalInvoiceCard invoice={invoice} isWorker={isWorker} />
                    <ReviewCard review={review} {...reviewProps} />
                </div>
            ) : (
                <ReviewCard review={review} {...reviewProps} />
            )}
        </div>
    );
}
