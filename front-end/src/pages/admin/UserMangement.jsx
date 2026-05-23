import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Wallet,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  ShieldCheck,
  UserX,
  CheckCircle2,
  Clock3,
  XCircle,
  ChevronDown,
} from "lucide-react";

const UserManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const users = [
    {
      id: 1,
      name: "Rahul Kumar",
      phone: "+91 9876543210",
      role: "Worker",
      verification: "Verified",
      status: "Active",
      image: "https://i.pravatar.cc/100?img=11",
    },
    {
      id: 2,
      name: "Amit Sharma",
      phone: "+91 9876543211",
      role: "Poster",
      verification: "Pending",
      status: "Active",
      image: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: 3,
      name: "Meera Jain",
      phone: "+91 9876543212",
      role: "Worker",
      verification: "Rejected",
      status: "Suspended",
      image: "https://i.pravatar.cc/100?img=13",
    },
  ];

  const selectedUser = {
    name: "Rahul Kumar",
    role: "Senior Electrician",
    joined: "Joined Jan 2024",
    location: "Kochi, Kerala",
    completedJobs: 142,
    earnings: "₹84,500",
    rating: "4.9",
    image: "https://i.pravatar.cc/200?img=15",
    skills: [
      "Electrical",
      "Wiring",
      "Installation",
      "Maintenance",
    ],
  };

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      {/* SIDEBAR */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 shadow-sm flex flex-col justify-between ${
          sidebarOpen ? "w-[260px]" : "w-[90px]"
        }`}
      >
        <div>
          {/* LOGO */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-gray-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-11 h-11 rounded-xl bg-[#0A6E5C] flex items-center justify-center text-white font-bold text-lg">
                N
              </div>

              {sidebarOpen && (
                <div>
                  <h1 className="text-2xl font-bold text-[#111827]">
                    NEXARO
                  </h1>

                  <p className="text-xs text-gray-500">
                    Editorial Premium
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-[#0A6E5C]"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* NAVIGATION */}
          <div className="p-4 space-y-2">
            {[
              {
                label: "Dashboard",
                icon: <LayoutDashboard size={20} />,
              },
              {
                label: "Users",
                icon: <Users size={20} />,
              },
              {
                label: "Tasks",
                icon: <ClipboardList size={20} />,
              },
              {
                label: "Financials",
                icon: <Wallet size={20} />,
              },
              {
                label: "Notifications",
                icon: <Bell size={20} />,
              },
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  index === 1
                    ? "bg-[#0A6E5C] text-white"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                }`}
              >
                {item.icon}

                {sidebarOpen && (
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />

            {sidebarOpen && (
              <span className="font-medium text-sm">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {/* HEADER */}
        <div className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-[#111827]">
              User Management
            </h2>

            <p className="text-gray-500 mt-1">
              Manage workers and posters across the platform.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-[#0A6E5C]">
              <Bell size={22} />

              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <img
                src="https://i.pravatar.cc/100"
                alt="admin"
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="hidden sm:block">
                <h4 className="text-sm font-semibold text-[#111827]">
                  Admin User
                </h4>

                <p className="text-xs text-gray-500">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {/* FILTERS */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <button className="h-14 px-5 bg-white border border-gray-200 rounded-2xl flex items-center justify-between text-gray-600 min-w-[180px]">
              All Roles
              <ChevronDown size={18} />
            </button>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 flex items-center gap-3 h-14">
              <Search size={20} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search by name, phone or email..."
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>

            <button className="h-14 px-6 rounded-2xl bg-[#0A6E5C] text-white font-semibold hover:opacity-90 transition-all">
              View Verification Panel
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* USER TABLE */}
            <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="border-b border-gray-100">
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="px-6 py-5">Name</th>
                      <th className="px-6 py-5">Role</th>
                      <th className="px-6 py-5">Verification</th>
                      <th className="px-6 py-5">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-50 hover:bg-[#F6FAF8] transition-all"
                      >
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />

                            <div>
                              <h4 className="font-semibold text-[#111827]">
                                {user.name}
                              </h4>

                              <p className="text-sm text-gray-500">
                                {user.phone}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-6">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#0A6E5C]">
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            {user.verification ===
                              "Verified" && (
                              <CheckCircle2
                                size={18}
                                className="text-emerald-600"
                              />
                            )}

                            {user.verification ===
                              "Pending" && (
                              <Clock3
                                size={18}
                                className="text-yellow-500"
                              />
                            )}

                            {user.verification ===
                              "Rejected" && (
                              <XCircle
                                size={18}
                                className="text-red-500"
                              />
                            )}

                            <span
                              className={`font-medium text-sm ${
                                user.verification ===
                                "Verified"
                                  ? "text-emerald-600"
                                  : user.verification ===
                                    "Pending"
                                  ? "text-yellow-600"
                                  : "text-red-500"
                              }`}
                            >
                              {user.verification}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-6">
                          <span
                            className={`font-medium ${
                              user.status === "Active"
                                ? "text-emerald-600"
                                : "text-red-500"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-5 text-sm text-gray-500">
                Showing 3 of 4,291 active users
              </div>
            </div>

            {/* PROFILE CARD */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-emerald-100"
                  />

                  <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white" />
                </div>

                <h3 className="text-3xl font-bold text-[#111827] mt-5">
                  {selectedUser.name}
                </h3>

                <p className="text-[#0A6E5C] font-medium mt-2">
                  {selectedUser.role}
                </p>

                <div className="flex items-center gap-3 text-gray-500 text-sm mt-4">
                  <span>{selectedUser.joined}</span>
                  <span>•</span>
                  <span>{selectedUser.location}</span>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-[#F6FAF8] rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Completed Jobs
                  </p>

                  <h4 className="text-3xl font-bold text-[#111827] mt-2">
                    {selectedUser.completedJobs}
                  </h4>
                </div>

                <div className="bg-[#F6FAF8] rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Earnings
                  </p>

                  <h4 className="text-3xl font-bold text-emerald-600 mt-2">
                    {selectedUser.earnings}
                  </h4>
                </div>
              </div>

              {/* SKILLS */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Skills
                </h4>

                <div className="flex flex-wrap gap-3 mt-4">
                  {selectedUser.skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-emerald-100 text-[#0A6E5C] text-sm font-medium"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* RATING */}
              <div className="mt-8 bg-[#F6FAF8] rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#111827]">
                    Platform Rating
                  </h4>

                  <span className="text-yellow-500 font-bold">
                    {selectedUser.rating} ★
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                  Rahul consistently delivers high quality
                  work and maintains excellent communication
                  with clients.
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-4 mt-8">
                <button className="w-full h-14 rounded-2xl bg-[#0A6E5C] text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <ShieldCheck size={18} />
                  Verify Manually
                </button>

                <button className="w-full h-14 rounded-2xl bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                  <UserX size={18} />
                  Suspend User Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;