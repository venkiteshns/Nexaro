import { useSelector } from 'react-redux';
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";

const WorkerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
        <WorkerNavBar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <WorkerHeader />
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