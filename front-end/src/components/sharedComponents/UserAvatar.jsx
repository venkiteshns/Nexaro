import { useState, useEffect } from "react";

const resolveImageUrl = (val) => {
  if (!val) return null;
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof val === "object") {
    const candidate = val.url || val.secure_url || val.src || val.image;
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }
  return null;
};

const UserAvatar = ({
  user,
  className = "w-7 h-7",
  textClassName = "text-xs",
  defaultInitial = "U",
}) => {
  const [imageError, setImageError] = useState(false);

  const profileImage =
    resolveImageUrl(user?.selfie) ||
    resolveImageUrl(user?.avatar) ||
    resolveImageUrl(user?.profileImage) ||
    resolveImageUrl(user?.picture) ||
    resolveImageUrl(user?.verificationDocuments?.selfie) ||
    resolveImageUrl(user?.worker?.selfie) ||
    (typeof user === "string" ? resolveImageUrl(user) : null);

  useEffect(() => {
    setImageError(false);
  }, [profileImage]);

  const initial =
    user?.name && typeof user.name === "string"
      ? user.name.trim().charAt(0).toUpperCase()
      : defaultInitial;

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
