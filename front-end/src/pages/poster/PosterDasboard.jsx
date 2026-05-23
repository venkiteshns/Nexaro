import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../store/Slices/UserSlice';
import { useUserLogoutMutation } from '../../store/services/api';
import { LogOut } from 'lucide-react';

const PosterDasboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [userLogout] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
    } catch (error) {
      // even if api call fails, we still log out the user locally
    } finally {
      dispatch(logOut());
      navigate('/user/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-[#0A6E5C]">Poster Dashboard</h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 border border-red-200 hover:bg-red-50 transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">{user?.name}</h2>
        <p className="text-gray-500 mt-1">{user?.email}</p>
        <p className="text-sm text-[#0A6E5C] font-medium mt-1">{user?.role}</p>
      </div>
    </div>
  );
};

export default PosterDasboard;