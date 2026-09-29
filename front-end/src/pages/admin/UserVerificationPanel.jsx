import { useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AdminNavBar from "../../layouts/Admin/AdminNavBar";
import AdminHeader from "../../layouts/Admin/AdminHeader";
import PaginationSections from "../../components/sharedComponents/PaginationSections";
import {
  useAdminApproveUserMutation,
  useAdminGetPendingVerificationUsersQuery,
  useAdminRejectUserMutation,
} from "../../store/services/adminApi";
import { useLocation } from "react-router-dom";

const UserVerificationPanel = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState(location.state?.userName || "");

  const [approveUser] = useAdminApproveUserMutation();
  const [rejectUser] = useAdminRejectUserMutation();

  const { data, isLoading, isError } = useAdminGetPendingVerificationUsersQuery(
    {
      page: currentPage,
      limit: 2,
    },
  );

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const totalUsers = data?.totalUsers || 0;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchName.toLowerCase())
  );

  if (totalPages > 0 && currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const handleRejectUser = async (id) => {
    await rejectUser(id)
  }

  const handleApproveUser = async (id) => {
    await approveUser(id)
  }


  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row md:overflow-hidden bg-[#f5f7f6]">
      <AdminNavBar />

      <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
        <AdminHeader />

        <main className="flex-1 md:overflow-y-auto p-3 sm:p-6 md:p-8 pb-28 sm:pb-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
            <StatCard
              title="Pending Review"
              value={totalUsers}
              color="border-yellow-500"
              text="Awaiting verification"
            />
            <StatCard
              title="Current Page"
              value={currentPage}
              color="border-emerald-500"
              text={`of ${totalPages} pages`}
            />
            <StatCard
              title="Showing"
              value={users.length}
              color="border-blue-400"
              text="users on this page"
            />
          </div>

          <div className="mt-3.5 sm:mt-6 bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 sm:top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search users..."
                className="w-full bg-[#f7f7f7] border border-gray-200 rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm outline-none focus:border-[#0A6E5C]"
              />
            </div>
          </div>

          {isLoading && (
            <div className="mt-8 text-center text-gray-400">
              Loading users...
            </div>
          )}

          {isError && (
            <div className="mt-8 text-center text-red-400">
              Failed to load users. Please try again.
            </div>
          )}

          {!isLoading && !isError && users.length === 0 && (
            <div className="mt-8 text-center text-gray-400">
              No users pending verification.
            </div>
          )}

          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
            {!isLoading &&
              !isError &&
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden shadow-2xs"
                >
                  <div className="p-3.5 sm:p-5 md:p-7">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {user.verificationDocuments?.selfie?.url ? (
                          <img
                            src={user.verificationDocuments.selfie.url}
                            alt={user.name}
                            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-base sm:text-xl shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                            <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                              {user.name}
                            </h2>
                            <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-yellow-100 text-yellow-700">
                              PENDING
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-100 text-[#0A6E5C] capitalize">
                              {user.activeRole}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1 sm:mt-2">
                            <span>{user.email}</span>
                            {user.phone && <span>{user.phone}</span>}
                            {(user.city || user.state) && (
                              <span>{[user.city, user.state].filter(Boolean).join(", ")}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5 mt-3.5 sm:mt-6 md:mt-8">
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-gray-400 uppercase mb-1.5 sm:mb-2 truncate">
                          ID Front ({user.verificationDocuments?.idType || "ID"})
                        </p>
                        {user.verificationDocuments?.idFront?.url ? (
                          <img
                            src={user.verificationDocuments.idFront.url}
                            alt="ID Front"
                            className="h-24 sm:h-36 md:h-44 w-full rounded-xl sm:rounded-2xl object-cover border border-gray-200 shadow-2xs"
                          />
                        ) : (
                          <div className="h-24 sm:h-36 md:h-44 rounded-xl sm:rounded-2xl border border-gray-200 bg-[#f5f7f6] flex items-center justify-center p-2 text-center">
                            <span className="text-gray-400 text-xs sm:text-sm font-medium">
                              Not uploaded
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-gray-400 uppercase mb-1.5 sm:mb-2 truncate">
                          ID Back
                        </p>
                        {user.verificationDocuments?.idBack?.url ? (
                          <img
                            src={user.verificationDocuments.idBack.url}
                            alt="ID Back"
                            className="h-24 sm:h-36 md:h-44 w-full rounded-xl sm:rounded-2xl object-cover border border-gray-200 shadow-2xs"
                          />
                        ) : (
                          <div className="h-24 sm:h-36 md:h-44 rounded-xl sm:rounded-2xl border border-gray-200 bg-[#f5f7f6] flex items-center justify-center p-2 text-center">
                            <span className="text-gray-400 text-xs sm:text-sm font-medium">
                              Not uploaded
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-gray-400 uppercase mb-1.5 sm:mb-2 truncate">
                          Selfie
                        </p>
                        {user.verificationDocuments?.selfie?.url ? (
                          <img
                            src={user.verificationDocuments.selfie.url}
                            alt="Selfie"
                            className="h-24 sm:h-36 md:h-44 w-full rounded-xl sm:rounded-2xl object-cover border border-gray-200 shadow-2xs"
                          />
                        ) : (
                          <div className="h-24 sm:h-36 md:h-44 rounded-xl sm:rounded-2xl border border-gray-200 bg-[#f5f7f6] flex items-center justify-center p-2 text-center">
                            <span className="text-gray-400 text-xs sm:text-sm font-medium">
                              Not uploaded
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mt-3.5 sm:mt-6 md:mt-8 pt-3 sm:pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        <button
                          onClick={() => handleApproveUser(user._id)}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#0A6E5C] text-white text-xs sm:text-sm font-medium hover:bg-[#085646] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>

                        <button
                          onClick={() => handleRejectUser(user._id)}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-red-300 text-red-500 text-xs sm:text-sm font-medium hover:bg-red-50 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {!isLoading && !isError && users.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 mt-3.5 sm:mt-6 md:mt-8 bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 shadow-2xs">
              <p className="text-xs sm:text-sm text-gray-500">
                Page <span className="font-semibold text-gray-800">{currentPage}</span> of{" "}
                <span className="font-semibold text-gray-800">{totalPages}</span> ·{" "}
                <span className="font-semibold text-gray-800">{totalUsers}</span> total users
              </p>

              <PaginationSections
                totalPages={totalPages}
                page={currentPage}
                onPageChange={(newPage) => setCurrentPage(newPage)}
                alwaysShow={true}
                className="mt-0 pb-0"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function StatCard({ title, value, text, color }) {
  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl border border-gray-200 border-l-[3px] sm:border-l-4 ${color} p-2.5 sm:p-4 md:p-6 shadow-2xs min-w-0`}
    >
      <h3 className="text-gray-500 text-[11px] sm:text-xs md:text-sm font-medium truncate">{title}</h3>
      <div className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1.5">{value}</div>
      <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">{text}</p>
    </div>
  );
}

export default UserVerificationPanel;
