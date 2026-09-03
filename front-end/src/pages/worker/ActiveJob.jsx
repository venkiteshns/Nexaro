import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import WorkerNavBar from '../../layouts/Worker/WorkerNavBar';
import WorkerHeader from '../../layouts/Worker/WorkerHeader';
import PageLoader from '../../components/sharedComponents/PageLoader';
import PageError from '../../components/sharedComponents/PageError';

import ActiveJobHeader from '../../components/Worker/ActiveJob/ActiveJobHeader';
import TaskOverviewHeader from '../../components/Worker/ActiveJob/TaskOverviewHeader';
import PosterSummaryCard from '../../components/Worker/ActiveJob/PosterSummaryCard';
import JobChecklistCard, { doneCount } from '../../components/Worker/ActiveJob/JobChecklistCard';
import TaskFinalizationCard from '../../components/Worker/ActiveJob/TaskFinalizationCard';
import DirectionsCard from '../../components/Worker/ActiveJob/DirectionsCard';
import ContactPosterCard from '../../components/Worker/ActiveJob/ContactPosterCard';
import CompleteJobModal from '../../components/Worker/ActiveJob/CompleteJobModal';

import { useGetWorkerActiveJobQuery, useUpdateJobProgressMutation } from '../../store/services/workerApi';
import { showSuccess, showError } from '../../utils/toast';

const ActiveJob = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [revealPhone, setRevealPhone] = useState(false);

    const { data, isLoading, isError } = useGetWorkerActiveJobQuery(taskId);
    const [updateProgress, { isLoading: isUpdating }] = useUpdateJobProgressMutation();

    const mainData = data?.data;
    const { bid, poster } = mainData ?? {};
    const update = mainData?.update ?? 'not_started';
    const done = doneCount(update);
    const pct = Math.round((done / 5) * 100);

    const handleStepUpdate = async (step) => {
        try {
            const res = await updateProgress({ taskId, update: step }).unwrap();
            showSuccess(res?.message || 'Progress updated!');
        } catch (err) {
            showError(err?.data?.message || 'Failed to update. Try again.');
        }
    };

    const handleComplete = async () => {
        await handleStepUpdate('completed');
        setShowCompleteModal(false);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            <WorkerNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <WorkerHeader />

                {isLoading && (
                    <PageLoader
                        title="Loading Active Job"
                        text="Fetching your task details…"
                    />
                )}
                {isError && (
                    <PageError
                        onBack={() => navigate('/worker/my-bids', { replace: true })}
                        title="Failed to Load"
                        message="We couldn't fetch your active job. Please check your connection and try again."
                        buttonText="Back to My Bids"
                    />
                )}

                {!isLoading && !isError && mainData && (
                    <div className="flex-1 overflow-y-auto">
                        <ActiveJobHeader onBack={() => navigate('/worker/my-bids', { replace: true })} />

                        <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4">
                            <TaskOverviewHeader mainData={mainData} bid={bid} />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2 space-y-4">
                                    <PosterSummaryCard
                                        poster={poster}
                                        amount={bid?.amount ?? mainData.amount}
                                    />

                                    <JobChecklistCard
                                        done={done}
                                        pct={pct}
                                        isUpdating={isUpdating}
                                        onStepUpdate={handleStepUpdate}
                                        onRequestComplete={() => setShowCompleteModal(true)}
                                    />

                                    <TaskFinalizationCard
                                        update={update}
                                        onMarkComplete={() => setShowCompleteModal(true)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <DirectionsCard
                                        address={mainData.address}
                                        location={mainData.location}
                                    />

                                    <ContactPosterCard
                                        phone={poster?.phone}
                                        revealPhone={revealPhone}
                                        onReveal={() => setRevealPhone(true)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showCompleteModal && (
                <CompleteJobModal
                    onConfirm={handleComplete}
                    onClose={() => setShowCompleteModal(false)}
                    isLoading={isUpdating}
                />
            )}
        </div>
    );
};

export default ActiveJob;
