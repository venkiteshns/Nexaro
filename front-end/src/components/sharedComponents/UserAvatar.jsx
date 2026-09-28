import { useState } from "react";

const UserAvatar = ({
  user,
  className = "w-7 h-7",
  textClassName = "text-xs",
  defaultInitial = "U",
}) => {
  const [imageError, setImageError] = useState(false);

  const profileImage =
    user?.selfie ||
    user?.avatar ||
    (typeof user?.verificationDocuments?.selfie === "string"
      ? user?.verificationDocuments?.selfie
      : user?.verificationDocuments?.selfie?.url) ||
    user?.profileImage;

  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : defaultInitial;

  if (profileImage && !imageError) {
    return (
      <img
        src={profileImage}
        alt={user?.name || "Profile avatar"}
        onError={() => setImageError(true)}
        className={`${className} rounded-full object-cover shrink-0 border border-emerald-100 shadow-2xs`}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold ${textClassName} shrink-0 select-none shadow-2xs`}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
