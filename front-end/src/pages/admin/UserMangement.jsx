import React, { useState } from "react";
import AdminNavBar from "../../layouts/Admin/AdminNavBar";
import AdminHeader from "../../layouts/Admin/AdminHeader";
import {
  Search, CheckCircle2, Clock3, ShieldCheck,
  UserX, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import {
  useAdminGetUsersQuery,
  useAdminSuspendUserMutation,
  useAdminUnsuspendUserMutation,
} from "../../store/services/api";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e2f4f1'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%230A6E5C' opacity='.6'/%3E%3Cellipse cx='20' cy='36' rx='12' ry='8' fill='%230A6E5C' opacity='.4'/%3E%3C/svg%3E";

function MobileUserCard({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-full flex flex-col sm:flex-row items-center gap-3 px-4 py-4 border-b border-green-700 hover:bg-[#F6FAF8] transition-colors cursor-pointer active:bg-emerald-50"
    >
      <div className="relative shrink-0">
        <img
          src={user.verificationDocuments?.selfie?.url || DEFAULT_AVATAR}
          alt={user.name}
          className="w-11 h-11 rounded-full object-cover"
        />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.isSuspended ? "bg-red-400" : "bg-emerald-500"
            }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#111827] text-sm truncate">{user.name}</p>
        <p className="text-xs text-gray-400">{user.phone}</p>
      </div>

      <div className="flex justify-center gap-8 items-center">
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#0A6E5C] capitalize">
          {user.activeRole}
        </span>
        <span
          className={`text-xs font-semibold ${user.isVerified ? "text-emerald-600" : "text-yellow-500"
            }`}
        >


          {user.isVerified ? <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> "Verified" </span>
            : <span className="flex items-center gap-2"><Clock3 size={16} className="text-yellow-500" />"Pending"</span>}
        </span>
      </div>

    </div>
  );
}

function UserDetailPanel({ user, onClose, isMobile, navigate, onAction }) {
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-16">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <UserX size={32} className="text-gray-300" />
        </div>
        <p className="text-sm">Click on a user to see their details</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      )}

      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={user.verificationDocuments?.selfie?.url || DEFAULT_AVATAR}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
          />
          <div
            className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-4 border-white ${user.isSuspended ? "bg-red-400" : "bg-emerald-500"
              }`}
          />
        </div>
        <h3 className="text-2xl font-bold text-[#111827] mt-4">{user.name}</h3>
        <p className="text-[#0A6E5C] font-medium mt-1 capitalize">{user.activeRole}</p>
        <p className="text-sm text-gray-500 mt-2">{user.email}</p>
        <p className="text-gray-400 text-xs mt-0.5">
          {user.city}, {user.state}
        </p>
      </div>

      {/* Skills */}
      {user.skills?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Skills
          </h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {user.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-emerald-100 text-[#0A6E5C] text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Status card */}
      <div className="mt-6 bg-[#F6FAF8] rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-[#111827] text-sm">Account Status</h4>
          <span
            className={`font-bold text-sm ${user.isSuspended ? "text-red-500" : "text-emerald-600"
              }`}
          >
            {user.isSuspended ? "Suspended" : "Active"}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Verification: {user.isVerified ? "Verified ✓" : "Pending"}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-6">
        {!user.isVerified && (
          <button
            onClick={() =>
              navigate("/admin/users/verification", {
                state: { userName: user.name },
              })
            }
            className="w-full py-3 rounded-2xl bg-[#0A6E5C] text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <ShieldCheck size={16} />
            Verify Manually
          </button>
        )}
        <button
          onClick={() => onAction(user._id, user.isSuspended)}
          className="w-full py-3 rounded-2xl bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <UserX size={16} />
          {user.isSuspended ? "Unsuspend Account" : "Suspend User Account"}
        </button>
      </div>
    </div>
  );
}

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading, isError } = useAdminGetUsersQuery({
    page: currentPage,
    limit: 10,
  });

  const navigate = useNavigate();
  const [suspendUser] = useAdminSuspendUserMutation();
  const [unsuspendUser] = useAdminUnsuspendUserMutation();

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const totalUsers = data?.totalUsers || 0;

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.activeRole === roleFilter;
    const matchesName = u.name.toLowerCase().includes(searchName.toLowerCase());
    return matchesRole && matchesName;
  });

  const selectedUser = users.find((u) => u._id === selectedUserId) || null;

  const handleSuspensionStatus = (id, isSuspended) => {
    try {
      isSuspended ? unsuspendUser(id) : suspendUser(id);
    } catch { }
  };

  const handleSelectUser = (id) => {
    setSelectedUserId(id);
    setDrawerOpen(true);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      <AdminNavBar />

      <div className="flex-1 overflow-y-auto">
        <AdminHeader />

        <div className="p-4 sm:p-6 flex flex-col gap-4">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="font-bold text-xl text-[#111827] flex-1">User Management</h2>
            <button
              onClick={() => navigate("/admin/users/verification")}
              className="sm:w-auto px-5 py-2.5 rounded-2xl bg-[#0A6E5C] text-sm text-white font-semibold hover:opacity-90 transition-all"
            >
              View Verification Panel
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-2.5 px-4 bg-white border border-gray-200 rounded-2xl text-sm text-gray-600 outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="worker">Worker</option>
              <option value="poster">Poster</option>
            </select>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search by name"
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Sidebar: user detail (xl+) */}
            <div className="hidden xl:block xl:order-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <UserDetailPanel
                user={selectedUser}
                isMobile={false}
                navigate={navigate}
                onAction={handleSuspensionStatus}
              />
            </div>

            <div className="xl:order-1 xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

              <div className="lg:hidden divide-y divide-gray-50">
                {isLoading && (
                  <p className="px-5 py-12 text-center text-gray-400 text-sm">Loading users...</p>
                )}
                {isError && (
                  <p className="px-5 py-12 text-center text-red-400 text-sm">
                    Failed to load users. Please try again.
                  </p>
                )}
                {!isLoading && !isError && filteredUsers.length === 0 && (
                  <p className="px-5 py-12 text-center text-gray-400 text-sm">No users found.</p>
                )}
                {!isLoading && !isError &&
                  filteredUsers.map((user) => (
                    <MobileUserCard
                      key={user._id}
                      user={user}
                      onClick={() => handleSelectUser(user._id)}
                    />
                  ))}
              </div>

              {/* Desktop table (lg+) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-100">
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="px-6 py-5 font-medium">Name</th>
                      <th className="px-6 py-5 font-medium">Role</th>
                      <th className="px-6 py-5 font-medium">Verification</th>
                      <th className="px-6 py-5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                          Loading users...
                        </td>
                      </tr>
                    )}
                    {isError && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-red-400">
                          Failed to load users. Please try again.
                        </td>
                      </tr>
                    )}
                    {!isLoading && !isError && filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                          No users found.
                        </td>
                      </tr>
                    )}
                    {!isLoading && !isError &&
                      filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          onClick={() => handleSelectUser(user._id)}
                          className={`border-b border-gray-50 hover:bg-[#F6FAF8] transition-all cursor-pointer ${selectedUserId === user._id ? "bg-emerald-50/50" : ""
                            }`}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <img
                                  src={user.verificationDocuments?.selfie?.url || DEFAULT_AVATAR}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <span
                                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${user.isSuspended ? "bg-red-400" : "bg-emerald-500"
                                    }`}
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-[#111827] text-sm">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#0A6E5C] capitalize">
                              {user.activeRole}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-1.5">
                              {user.isVerified ? (
                                <>
                                  <CheckCircle2 size={16} className="text-emerald-600" />
                                  <span className="text-sm font-medium text-emerald-600">Verified</span>
                                </>
                              ) : (
                                <>
                                  <Clock3 size={16} className="text-yellow-500" />
                                  <span className="text-sm font-medium text-yellow-600">Pending</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`font-medium text-sm ${user.isSuspended ? "text-red-500" : "text-emerald-600"
                                }`}
                            >
                              {user.isSuspended ? "Suspended" : "Active"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
                <p className="text-sm text-gray-500 order-2 sm:order-1">
                  Showing page {currentPage} of {totalPages} · {totalUsers} total users
                </p>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm font-medium text-gray-700 px-2">{currentPage}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile centered modal (< xl) ── */}
      {drawerOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto p-6">
            {/* Drag/close indicator */}
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
            <UserDetailPanel
              user={selectedUser}
              onClose={() => setDrawerOpen(false)}
              isMobile={true}
              navigate={navigate}
              onAction={handleSuspensionStatus}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
