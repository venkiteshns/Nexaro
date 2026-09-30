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
import { uploadFileToS3 } from "../../utils/s3Upload";

const PosterProfile = () => {
  const { data, isLoading } = useGetPosterProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

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

  const [switchRole, { isLoading: isApiLoading }] = useSwitchtoworkerMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const isSubmitting = isUploading || isApiLoading || submissionStatus === "switching";

  const [roleSwitch] = useSwitchRoleActiveWorkerMutation();
  const { user, accessToken, refreshToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRoleSwitchSubmission = async (data) => {
    setIsUploading(true);
    setSubmissionStatus("uploading");
    try {
      const uploadedDocs = {};
      const uploadPromises = [];

      if (data.id_front?.[0] instanceof File) {
        uploadPromises.push(
          uploadFileToS3(data.id_front[0], `user/${user?._id || "switch"}/verification`).then((res) => {
            uploadedDocs.idFront = res;
          })
        );
      }
      if (data.id_back?.[0] instanceof File) {
        uploadPromises.push(
          uploadFileToS3(data.id_back[0], `user/${user?._id || "switch"}/verification`).then((res) => {
            uploadedDocs.idBack = res;
          })
        );
      }
      if (data.selfie?.[0] instanceof File) {
        uploadPromises.push(
          uploadFileToS3(data.selfie[0], `user/${user?._id || "switch"}/verification`).then((res) => {
            uploadedDocs.selfie = res;
          })
        );
      }

      if (uploadPromises.length > 0) {
        try {
          await Promise.all(uploadPromises);
          data.uploadedDocuments = uploadedDocs;
        } catch (uploadErr) {
          console.warn("Direct S3 upload failed during role switch, using fallback stream:", uploadErr);
        }
      }

      setIsUploading(false);
      setSubmissionStatus("submitting");
      const res = await switchRole(data).unwrap();

      setSubmissionStatus("switching");
      const newAccessToken = res?.accessToken || accessToken;
      const updatedUser = {
        ...user,
        ...(res?.user || {}),
        activeRole: 'worker',
        role: 'worker'
      };
      showSuccess("Switching to Worker Mode");
      setTimeout(() => {
        dispatch(setCredentials({
          user: updatedUser,
          refreshToken,
          accessToken: newAccessToken
        }));
        navigate('/worker/dashboard', { replace: true });
      }, 2000);
    } catch (error) {
      setIsUploading(false);
      setSubmissionStatus("");
      showError(error?.data?.message || "Couldn't switch role now ! Try later..");
    }
  };

  const handleRoleSwitch = async () => {
    const hasWorkerData = Boolean(
      posterInfo.hasWorkerData ||
      posterInfo.isWorkerActive ||
      (posterInfo.skills?.length > 0 &&
        posterInfo.languages?.length > 0 &&
        (posterInfo.serviceArea?.coordinates?.length === 2 || posterInfo.serviceArea?.area || posterInfo.city))
    );

    if (hasWorkerData) {
      try {
        const res = await roleSwitch().unwrap();
        const newAccessToken = res?.accessToken || accessToken;
        const updatedUser = {
          ...user,
          ...(res?.user || {}),
          activeRole: 'worker',
          role: 'worker'
        };
        showSuccess("Switching to Worker Mode");
        setTimeout(() => {
          dispatch(setCredentials({
            user: updatedUser,
            refreshToken,
            accessToken: newAccessToken
          }));
          navigate('/worker/dashboard', { replace: true });
        }, 2600);
        return;
      } catch (error) {
        showWarning(error?.data?.message || "Unable to switch role ! Try again later...");
        return;
      }
    }

    setShowRoleSwitchModal(true);
  };

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row md:overflow-hidden bg-[#F6FAF8]">
      <PosterNavBar />

      <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
        <PosterHeader />

        <main className="flex-1 md:overflow-y-auto p-3 sm:p-5 lg:p-6 pb-28 sm:pb-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
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
        </main>
      </div>

      {showRoleSwitchModal && (
        <SwitchToWorkerModal
          isOpen={showRoleSwitchModal}
          onClose={() => !isSubmitting && setShowRoleSwitchModal(false)}
          onSwitch={handleRoleSwitchSubmission}
          isSubmitting={isSubmitting}
          submissionStatus={submissionStatus}
          posterInfo={posterInfo}
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
