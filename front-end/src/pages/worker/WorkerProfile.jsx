import { useState } from 'react';
import WorkerNavBar from '../../layouts/Worker/WorkerNavBar';
import WorkerHeader from '../../layouts/Worker/WorkerHeader';
import WorkerProfileBanner from '../../components/Worker/Profile/WorkerProfileBanner';
import WorkerStatCards from '../../components/Worker/Profile/WorkerStatCards';
import WorkerSkillsCard from '../../components/Worker/Profile/WorkerSkillsCard';
import WorkerAboutCard from '../../components/Worker/Profile/WorkerAboutCard';
import WorkerCredentialsCard from '../../components/Worker/Profile/WorkerCredentialsCard';
import WorkerReviewsSection from '../../components/Worker/Profile/WorkerReviewsSection';
import WorkerDangerZone from '../../components/Worker/Profile/WorkerDangerZone';
import { useGetWorkerProfileQuery } from '../../store/services/workerApi';
import DeleteProfileModal from '../../components/sharedComponents/DeleteProfileModal';


// ─────────────────────────────────────────────────────────────────────────────

const WorkerProfile = () => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const {isLoading, isError, isSuccess, data} = useGetWorkerProfileQuery();
    
    const raw = data?.profileData;
    console.log(raw);
    
    const workerData = {
        name: raw?.name,
        rating: raw?.reviewDetails?.topRating,
        avatar: raw?.avatar
    } || {};
    const stats = {
        jobsCompleted: raw?.jobsCompleted,
        totalEarned: raw?.wallet ? raw.wallet.totalEarned : 0 ,
        rating: raw?.worker?.rating
    }
    const languages = raw?.languages.length > 0 ? raw.languages : ['English']
    const bio = raw?.bio;
    const skills = raw?.skills;
    const credentials = {
        email: raw?.email,
        phone: raw?.phone,
        address: raw?.address,
        isVerified: raw?.isVerified
    }
    const reviews = raw?.reviewDetails?.reviews ;
    const reviewProps = reviews?.map((r) => {
        const payLoad = {
            reviewerName : r.reviewerData.name,
            rating: r.rating,
            text: r.review,
            avatar:r.reviewerData.avatar
        }
        return payLoad;
    }) || {};
    const totalReviewCount = raw?.reviewDetails?.Totalcount
    
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <WorkerNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <WorkerHeader />

                <div className="flex-1 overflow-y-auto p-4 md:p-6">

                        {/* ── Banner ── */}
                        <WorkerProfileBanner
                            worker={workerData}
                            onEditClick={() => console.log('Edit profile')}
                            onSwitchToPoster={() => console.log('Switch to poster')}
                        />

                        {/* ── Stats ── */}
                        <WorkerStatCards stats={stats} />

                        {/* ── Skills + About (side by side on md+) ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            <WorkerSkillsCard skills={skills} />
                            <WorkerAboutCard bio={bio} languages={languages} />
                        </div>

                        {/* ── Verified Credentials ── */}
                        <div className="mb-5">
                            <WorkerCredentialsCard credentials={credentials} />
                        </div>

                        {/* ── Reviews ── */}
                        <WorkerReviewsSection
                            reviews={reviewProps}
                            totalCount={totalReviewCount}
                            onViewAll={() => console.log('View all reviews')}
                        />

                        {/* ── Danger Zone ── */}
                        <WorkerDangerZone
                            onDeleteProfile={() => setShowDeleteConfirm(true)}
                        />

                        {/* ── Shared Delete Confirm Modal ── */}
                        {showDeleteConfirm && (
                            <DeleteProfileModal userId={raw?._id} onClose={() => setShowDeleteConfirm(false)} />
                        )}

                </div>
            </div>
        </div>

    );
};

export default WorkerProfile;
