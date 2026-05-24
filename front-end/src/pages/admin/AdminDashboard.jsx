import React from "react";
import AdminNavBar from "../../layouts/Admin/AdminNavBar";
import AdminHeader from "../../layouts/Admin/AdminHeader";

const AdminDashboard = () => {


  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      {/* SIDEBAR */}
       <AdminNavBar />

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <AdminHeader/>
        {/* CONTENT */}
        <div className="p-6">
          

          Admin Dashboard


        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;