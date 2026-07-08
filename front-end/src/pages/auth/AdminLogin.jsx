import AdminLoginBanner from "../../components/Admin/AdminLoginBanner";
import AdminLoginForm from "../../components/Admin/AdminLoginForm";

const AdminLogin = () => {

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col lg:flex-row overflow-hidden">
      <AdminLoginBanner />
      <AdminLoginForm />
    </div>
  );
};

export default AdminLogin;