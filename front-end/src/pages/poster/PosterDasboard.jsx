import React from 'react';
import { useSelector } from 'react-redux';
import PosterNavBar from '../../layouts/Poster/PosterNavBar';
import PosterHeader from '../../layouts/Poster/PosterHeader';

const PosterDasboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="h-screen bg-[#F6FAF8] flex overflow-hidden">
      <PosterNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PosterHeader />

        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back, {user?.name}!</p>
        </div>
      </div>
    </div>
  );
};

export default PosterDasboard;