import { useCallback, useState } from "react";
import {
  ClipboardList,
  CheckCircle,
  DollarSign,
  Star,
} from "lucide-react";
import { useGetPosterProfileQuery, useSwitchRoleActiveWorkerMutation, useSwitchtoworkerMutation } from "../../store/services/posterApi";

import PosterNavBar from "../../layouts/Poster/PosterNavBar";
import PosterHeader from "../../layouts/Poster/PosterHeader";

import ProfileBanner from "../../components/Poster/Profile/ProfileBanner";
import StatCard from "../../components/Poster/Profile/StatCard";
import PersonalInfo from "../../components/Poster/Profile/PersonalInfo";
import RecentTasks from "../../components/Poster/Profile/RecentTasks";
import ReviewsSection from "../../components/Poster/Profile/ReviewsSection";
import DangerZone from "../../components/Poster/Profile/DangerZone";
import DeleteProfileModal from "../../components/sharedComponents/DeleteProfileModal";
import EditProfileModal from "./EditProfileModal";
import SwitchToWorkerModal from "../../components/Poster/RoleSwitch/SwitchToWorkerModal";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../store/Slices/UserSlice";
import { showError, showSuccess, showWarning } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const PosterProfile = () => {
  const { data, isLoading } = useGetPosterProfileQuery();

  const [reviewPage, setReviewPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleSwitchModal, setShowRoleSwitchModal] = useState(false);

  const profileData = data?.data || {};
  const stats = profileData.stats || {
    totalPosted: 0,
    totalCompleted: 0,
    totalSpent: 0,
    reviewsGiven: 0,
  };
  const recentTasks = profileData.recentTasks || [];
  const reviews = profileData.reviews || [];
  const posterInfo = profileData.poster || {};

  const [switchRole, { isLoading: isSubmitting }] = useSwitchtoworkerMutation();
  const [roleSwitch] = useSwitchRoleActiveWorkerMutation();
  const { user, accessToken, refreshToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRoleSwitchSubmission = async (data) => {
    try {
      let response = await switchRole(data).unwrap();
      console.log(response);
      const updatedUser = { ...user, role: 'worker' };
      showSuccess("Switching to Worker Mode");
      setTimeout(() => {
        dispatch(setCredentials({
          user: updatedUser,
          refreshToken,
          accessToken
        }))
        navigate('/worker/dashboard', { replace: true });
      }, 2600);
    } catch (error) {
      console.log(error);
      showError(error?.data?.message || "Couldn't switch role now ! Try later..");
    }
    console.log("RoleData", data);
  }

  const handleRoleSwitch = async () => {
    if (posterInfo.isWorkerActive) {
      try {
        await roleSwitch().unwrap();
        console.log("redirect to worker profile");
        const updatedUser = { ...user, role: 'worker' };
        showSuccess("Switching to Worker Mode");
        setTimeout(() => {
          dispatch(setCredentials({
            user: updatedUser,
            refreshToken,
            accessToken
          }))
          navigate('/worker/dashboard', { replace: true });
        }, 2600);
        return;
      } catch (error) {
        showWarning(error.data.message || "Unable to switch role ! Try again later...");
      }

    }
    setShowRoleSwitchModal(true);
    console.log("redirect to role switch modal");
  }

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <PosterNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PosterHeader />

        <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <ProfileBanner
            posterInfo={posterInfo}
            isLoading={isLoading}
            onEditClick={() => setShowEditModal(true)}
            onRoleSwitch={handleRoleSwitch}
          />

          {isLoading ? (
            <div className="flex flex-wrap gap-3 mb-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 shadow-xs p-2.5 sm:p-3.5 flex flex-col items-start gap-1.5 sm:gap-2 flex-1 min-w-[75px] sm:min-w-[110px]"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100" />
                  <div className="w-12 h-4 sm:h-5 bg-gray-100 rounded" />
                  <div className="w-16 h-2.5 sm:h-3 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 mb-4">
              <StatCard
                icon={<ClipboardList size={18} />}
                label="Tasks Posted"
                value={stats.totalPosted}
                color="#0A6E5C"
              />
              <StatCard
                icon={<CheckCircle size={18} />}
                label="Completed"
                value={stats.totalCompleted}
                color="#16a34a"
              />
              <StatCard
                icon={<DollarSign size={18} />}
                label="Total Spent"
                value={`₹${stats.totalSpent.toLocaleString("en-IN")}`}
                color="#d97706"
              />
              <StatCard
                icon={<Star size={18} />}
                label="Reviews Given"
                value={stats.reviewsGiven}
                color="#7c3aed"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <PersonalInfo posterInfo={posterInfo} isLoading={isLoading} />
            <RecentTasks recentTasks={recentTasks} isLoading={isLoading} />
          </div>

          <ReviewsSection
            reviews={reviews}
            isLoading={isLoading}
            reviewPage={reviewPage}
            setReviewPage={setReviewPage}
          />

          <DangerZone onDeleteClick={() => setShowDeleteModal(true)} />
        </div>
      </div>

      {showRoleSwitchModal && (
        <SwitchToWorkerModal
          isOpen={showRoleSwitchModal}
          onClose={() => setShowRoleSwitchModal(false)}
          onSwitch={handleRoleSwitchSubmission}
          isSubmitting={isSubmitting}
        />
      )}
      {showDeleteModal && (
        <DeleteProfileModal userId={profileData?.poster?._id} onClose={closeDeleteModal} />
      )}
      {showEditModal && (
        <EditProfileModal
          posterInfo={posterInfo}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default PosterProfile;
