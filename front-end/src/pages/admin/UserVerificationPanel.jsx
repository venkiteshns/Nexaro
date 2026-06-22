import { useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminNavBar from "../../layouts/Admin/AdminNavBar";
import AdminHeader from "../../layouts/Admin/AdminHeader";
import {
  useAdminApproveUserMutation,
  useAdminGetPendingVerificationUsersQuery,
  useAdminRejectUserMutation,
} from "../../store/services/api";
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
      limit: 10,
    },
  );

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const totalUsers = data?.totalUsers || 0;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleRejectUser = async (id) => {
    await rejectUser(id)
    console.log(id);
  }

  const handleApproveUser = async (id) => {
    await approveUser(id)
    console.log(id);
  }


  return (
    <div className="min-h-screen bg-[#f5f7f6] flex">
      <AdminNavBar />

      <main className="flex-1">
        <AdminHeader />

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

          <div className="mt-8 bg-white border border-gray-200 rounded-3xl p-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search users..."
                className="w-full bg-[#f7f7f7] border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#0A6E5C]"
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

          <div className="space-y-6 mt-8">
            {!isLoading &&
              !isError &&
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-5 md:p-7">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {user.verificationDocuments?.selfie?.url ? (
                          <img
                            src={user.verificationDocuments.selfie.url}
                            alt={user.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-xl">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-900">
                              {user.name}
                            </h2>
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                              PENDING
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#0A6E5C] capitalize">
                              {user.activeRole}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                            <span>{user.email}</span>
                            <span>{user.phone}</span>
                            <span>
                              {user.city}, {user.state}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="self-start lg:self-auto p-2 rounded-xl hover:bg-gray-100">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-3">
                          ID Front ({user.verificationDocuments?.idType || "ID"}
                          )
                        </p>
                        {user.verificationDocuments?.idFront?.url ? (
                          <img
                            src={user.verificationDocuments.idFront.url}
                            alt="ID Front"
                            className="h-44 w-full rounded-2xl object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-44 rounded-2xl border border-gray-200 bg-[#f5f7f6] flex items-center justify-center">
                            <span className="text-gray-400 text-sm">
                              Not uploaded
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-3">
                          ID Back
                        </p>
                        {user.verificationDocuments?.idBack?.url ? (
                          <img
                            src={user.verificationDocuments.idBack.url}
                            alt="ID Back"
                            className="h-44 w-full rounded-2xl object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-44 rounded-2xl border border-gray-200 bg-[#f5f7f6] flex items-center justify-center">
                            <span className="text-gray-400 text-sm">
                              Not uploaded
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-3">
                          Verification Selfie
                        </p>
                        {user.verificationDocuments?.selfie?.url ? (
                          <img
                            src={user.verificationDocuments.selfie.url}
                            alt="Selfie"
                            className="h-44 w-full rounded-2xl object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-44 rounded-2xl border border-gray-200 bg-[#f5f7f6] flex items-center justify-center">
                            <span className="text-gray-400 text-sm">
                              Not uploaded
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
                      <div className="flex flex-wrap gap-3">
                        <button onClick={() => {
                          handleApproveUser(user._id)
                        }} className="px-3 py-2 rounded-xl bg-[#0A6E5C] text-white text-sm font-medium hover:bg-[#085646] transition-all flex items-center gap-2">
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>

                        <button onClick={() => { handleRejectUser(user._id) }} className="px-3 py-2 rounded-xl border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition-all flex items-center gap-2">
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>

                        <button className="px-3 py-2 rounded-xl border border-yellow-300 text-yellow-700 text-sm font-medium hover:bg-yellow-50 transition-all flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3" />
                          Request Re-upload
                        </button>
                      </div>

                      <button className="px-3 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                        Request More Info
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {!isLoading && !isError && totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages} · {totalUsers} total users
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-sm font-medium text-gray-700 px-2">
                  {currentPage}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function StatCard({ title, value, text, color }) {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200 border-l-4 ${color} p-6`}
    >
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <div className="text-xl font-bold text-gray-900 mt-3">{value}</div>
      <p className="text-sm text-gray-400 mt-2">{text}</p>
    </div>
  );
}

export default UserVerificationPanel;
