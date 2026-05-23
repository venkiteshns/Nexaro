import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogOut } from "../../store/Slices/AdminSlice";
import { useAdminLogoutMutation } from "../../store/services/api";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Logo from "../../components/Logo/Logo";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [adminLogoutApi] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      await adminLogoutApi().unwrap();
    } catch {
      // Still log out locally even if backend call fails
    } finally {
      dispatch(adminLogOut());
      navigate("/admin/login");
    }
  };

  const recentUsers = [
    {
      name: "Rahul Kumar",
      role: "Worker",
      joined: "12 mins ago",
    },
    {
      name: "Amit Sharma",
      role: "Poster",
      joined: "45 mins ago",
    },
    {
      name: "Priya Tyagi",
      role: "Worker",
      joined: "2 hours ago",
    },
    {
      name: "Meera Jain",
      role: "Poster",
      joined: "5 hours ago",
    },
  ];

  const activities = [
    "New worker registered",
    "Task flagged by AI monitor",
    "Payout released",
    "Verification approved",
    "New task posted",
  ];

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      {/* SIDEBAR */}
      <div
        className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col justify-between ${
          sidebarOpen ? "w-[260px]" : "w-[90px]"
        }`}
      >
        <div>
          {/* LOGO */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-gray-100">
            <div className="flex items-center gap-3 overflow-hidden">
              {sidebarOpen && (
                <div>
                  <Logo/>
                  <p className="text-xs text-gray-500">
                    Admin Panel
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

          {/* NAV ITEMS */}
          <div className="p-4 space-y-2">
            {[
              {
                label: "Dashboard",
                icon: <LayoutDashboard size={20} />,
              },
              {
                label: "Users",
                icon: <Users size={20} />,
              }
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  index === 0
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />

            {sidebarOpen && (
              <span className="font-medium text-sm">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">

        {/* DASHBOARD CONTENT */}
        <div className="p-6">
          

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            <div className="xl:col-span-2 space-y-6">
              

              {/* users */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#111827]">
                    Recent Signups
                  </h3>

                  <button className="text-[#0A6E5C] font-medium">
                    View all
                  </button>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                        <th className="pb-4">User</th>
                        <th className="pb-4">Role</th>
                        <th className="pb-4">Joined</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentUsers.map((user, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-50"
                        >
                          <td className="py-5 font-medium text-[#111827]">
                            {user.name}
                          </td>

                          <td className="py-5">
                            <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-[#0A6E5C] font-semibold">
                              {user.role}
                            </span>
                          </td>

                          <td className="py-5 text-gray-500">
                            {user.joined}
                          </td>

                          <td className="py-5">
                            <span className="text-emerald-600 font-medium">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;