import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../store/Slices/UserSlice';
import { useUserLogoutMutation } from '../../store/services/api';
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";

const WorkerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [userLogout] = useUserLogoutMutation();

  // const handleLogout = async () => {
  //   try {
  //     await userLogout().unwrap();
  //   } catch {
  //   } finally {
  //     dispatch(logOut());
  //     navigate('/user/login');
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
        <WorkerNavBar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <WorkerHeader />

          {/* <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <h1 className="text-xl font-bold text-[#0A6E5C]">Worker Dashboard</h1>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 border border-red-200 hover:bg-red-50 transition-all text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div> */}

          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 mt-1">{user?.email}</p>
            <p className="text-sm text-[#0A6E5C] font-medium mt-1">{user?.role}</p>
            {user?.selfie && (
              <img
                src={user.selfie}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover mt-4 border-2 border-[#0A6E5C]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;