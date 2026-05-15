import React from "react";

const STATS = [
  { value: "24,800+", label: "Active Experts" },
  { value: "98.2%", label: "Satisfaction Rate" },
  { value: "₹12.4M", label: "Worker Earnings" },
  { value: "15 Min", label: "Avg. Response" },
];

const Status = () => {
  return (
    <div>
      <div className="status grid grid-cols-2  md:grid-cols-4">
        {STATS.map((stats) => (
          <div key={stats.label} className="stats-cont border border-t-0 border-s-0  border-gray-500 py-8 text-xl flex flex-col items-center justify-center">
            <div>{stats.value}</div>
            <div>{stats.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;
