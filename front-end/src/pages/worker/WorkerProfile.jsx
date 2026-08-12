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
import { useGetWorkerProfileQuery, useSwitchRoleToPosterMutation, useUpdateWorkerProfileMutation } from '../../store/services/workerApi';
import DeleteProfileModal from '../../components/sharedComponents/DeleteProfileModal';
import EditWorkerProfileModal from '../../components/Worker/Profile/EditWorkerProfileModal'
import { showError, showSuccess, showWarning } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../store/Slices/UserSlice';


// ─────────────────────────────────────────────────────────────────────────────

const WorkerProfile = () => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const {data} = useGetWorkerProfileQuery();
    const [updateWorkerProfile, {isLoading:isProfileUpdating}] = useUpdateWorkerProfileMutation();
    const [switchRole] = useSwitchRoleToPosterMutation();

    const { user, accessToken, refreshToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEditProfile = async (data) => {
        try {
            let response = await updateWorkerProfile (data).unwrap();
            console.log(response);
            showSuccess(response.message)
            return setOpenEditModal(false);
        } catch (error) {
            console.error(error);
            showWarning(error.data.message);
        }
        console.log(data);
    }

    const navigateReviewPage = () => {
        // navigate all reviews
       return navigate('/worker/all-reviews')
    }

 
    const handleRoleChange = async() => {
        try {
            await switchRole().unwrap();
            const updatedUser = {
                ...user,
                role:'poster'
            }
             showSuccess("Switching to Poster Dashboard");
                  setTimeout(() => {
                    dispatch(setCredentials({
                      user: updatedUser,
                      refreshToken,
                      accessToken
                    }))
                    navigate('/poster/dashboard', { replace: true });
                  }, 2600);
        } catch (error) {
            showError(error.data.message || "Unable to switch role, try again later !")
        }
    }

    const toggleEditModal = () => {
        setOpenEditModal((p) => !p );
    }
    
    const raw = data?.profileData;
    // console.log(raw);
    
    const workerData = {
        name: raw?.name,
        rating: raw?.reviewDetails?.topRating,
        avatar: raw?.avatar,
        isVerified: raw?.isVerified
    };
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
    const totalReviewCount = raw?.reviewDetails?.Totalcount;
    const workerEditData = {
        name:workerData?.name,
        avatar: workerData?.avatar,
        email: credentials?.email,
        phone: credentials?.phone,
        skills,
        bio,
        languages,
        isVerified: credentials?.isVerified
    }
    
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <WorkerNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <WorkerHeader />

                <div className="flex-1 overflow-y-auto p-4 md:p-6">

                        {/* ── Banner ── */}
                        <WorkerProfileBanner
                            worker={workerData}
                            onEditClick={toggleEditModal}
                            onSwitchToPoster={handleRoleChange}
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
                            onViewAll={navigateReviewPage}
                        />

                        {/* ── Danger Zone ── */}
                        <WorkerDangerZone
                            onDeleteProfile={() => setShowDeleteConfirm(true)}
                        />

                        {/* ── Shared Delete Confirm Modal ── */}
                        {showDeleteConfirm && (
                            <DeleteProfileModal userId={raw?._id} onClose={() => setShowDeleteConfirm(false)} />
                        )}

                        {openEditModal && (
                            <EditWorkerProfileModal loading={isProfileUpdating} isOpen={openEditModal}  onClose ={toggleEditModal}  worker ={workerEditData}  onSave={handleEditProfile} />
                        )}

                </div>
            </div>
        </div>

    );
};

export default WorkerProfile;
