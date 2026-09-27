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
import { uploadFileToS3 } from '../../utils/s3Upload';

const WorkerProfile = () => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const { data, isLoading } = useGetWorkerProfileQuery();
    const [updateWorkerProfile, {isLoading:isProfileUpdating}] = useUpdateWorkerProfileMutation();
    const [switchRole] = useSwitchRoleToPosterMutation();

    const { user, accessToken, refreshToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEditProfile = async (data) => {
        try {
            let avatarObject = null;
            if (data.avatar instanceof File) {
                avatarObject = await uploadFileToS3(data.avatar, `user/${data.email}/verification`);
            }
            let response = await updateWorkerProfile({ ...data, avatarObject }).unwrap();
            showSuccess(response.message);
            return setOpenEditModal(false);
        } catch (error) {
            console.error(error);
            showWarning(error?.data?.message || "Failed to update profile");
        }
    };

    const navigateReviewPage = () => {
       return navigate('/worker/all-reviews')
    }


    const handleRoleChange = async() => {
        try {
            await switchRole().unwrap();
            const updatedUser = {
                ...user,
                role:'poster'
            }
             showSuccess("Switching to Poster Mode");
                  setTimeout(() => {
                    dispatch(setCredentials({
                      user: updatedUser,
                      refreshToken,
                      accessToken
                    }))
                    navigate('/poster/my-tasks', { replace: true });
                  }, 2600);
        } catch (error) {
            showError(error.data.message || "Unable to switch role, try again later !")
        }
    }

    const toggleEditModal = () => {
        setOpenEditModal((p) => !p );
    }

    const raw = data?.profileData;

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

                <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
                    <div className="max-w-6xl mx-auto space-y-3 sm:space-y-3.5">
                        <WorkerProfileBanner
                            worker={workerData}
                            isLoading={isLoading}
                            onEditClick={toggleEditModal}
                            onSwitchToPoster={handleRoleChange}
                        />

                        <WorkerStatCards stats={stats} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <WorkerSkillsCard skills={skills} />
                            <WorkerAboutCard bio={bio} languages={languages} />
                        </div>

                        <div>
                            <WorkerCredentialsCard credentials={credentials} />
                        </div>

                        <WorkerReviewsSection
                            reviews={reviewProps}
                            totalCount={totalReviewCount}
                            onViewAll={navigateReviewPage}
                        />

                        <WorkerDangerZone
                            onDeleteProfile={() => setShowDeleteConfirm(true)}
                        />

                        {showDeleteConfirm && (
                            <DeleteProfileModal userId={raw?._id} onClose={() => setShowDeleteConfirm(false)} />
                        )}

                        {openEditModal && (
                            <EditWorkerProfileModal loading={isProfileUpdating} isOpen={openEditModal}  onClose ={toggleEditModal}  worker ={workerEditData}  onSave={handleEditProfile} />
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default WorkerProfile;
