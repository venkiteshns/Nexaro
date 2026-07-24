import { useState } from "react";
import {
  ClipboardList,
  CheckCircle,
  DollarSign,
  Star,
  Loader,
} from "lucide-react";
import PosterNavBar from "../../layouts/Poster/PosterNavBar";
import PosterHeader from "../../layouts/Poster/PosterHeader";
import { useGetPosterProfileQuery } from "../../store/services/posterApi";

import ProfileBanner from "../../components/Poster/Profile/ProfileBanner";
import StatCard from "../../components/Poster/Profile/StatCard";
import PersonalInfo from "../../components/Poster/Profile/PersonalInfo";
import RecentTasks from "../../components/Poster/Profile/RecentTasks";
import ReviewsSection from "../../components/Poster/Profile/ReviewsSection";
import DangerZone from "../../components/Poster/Profile/DangerZone";
import DeleteProfileModal from "../../components/Poster/Profile/DeleteProfileModal";
import EditProfileModal from "./EditProfileModal";

const PosterProfile = () => {
  const { data, isLoading } = useGetPosterProfileQuery();

  const [reviewPage, setReviewPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <PosterNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PosterHeader />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <ProfileBanner
            posterInfo={posterInfo}
            onEditClick={() => setShowEditModal(true)}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-gray-400">
              <Loader size={20} className="animate-spin mr-2" /> Loading
              stats...
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 mb-5">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            <PersonalInfo posterInfo={posterInfo} />
            <RecentTasks recentTasks={recentTasks} isLoading={isLoading} />
          </div>

          <ReviewsSection
            reviews={reviews}
            reviewPage={reviewPage}
            setReviewPage={setReviewPage}
          />

          <DangerZone onDeleteClick={() => setShowDeleteModal(true)} />
        </div>
      </div>

      {showDeleteModal && (
        <DeleteProfileModal onClose={() => setShowDeleteModal(false)} />
      )}
      {showEditModal && (
        <EditProfileModal
          posterInfo={posterInfo}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default PosterProfile;
