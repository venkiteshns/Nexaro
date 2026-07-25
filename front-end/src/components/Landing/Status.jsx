const STATS = [
  { value: "24,800+", label: "Active Experts" },
  { value: "98.2%",   label: "Satisfaction Rate" },
  { value: "₹12.4M",  label: "Worker Earnings" },
  { value: "15 Min",  label: "Avg. Response" },
];

const Status = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f0fdf8 0%, #ffffff 50%, #ecfdf5 100%)",
        borderTop: "1px solid rgba(10,110,92,0.08)",
        borderBottom: "1px solid rgba(10,110,92,0.08)",
      }}
    >
      <div className="status grid grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="stats-cont py-10 text-center flex flex-col items-center justify-center relative"
            style={{
              borderRight:
                i < STATS.length - 1
                  ? "1px solid rgba(10,110,92,0.1)"
                  : "none",
            }}
          >
            {/* subtle top accent line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full"
              style={{
                background: "linear-gradient(90deg, #0a6e5c, #10b981)",
                opacity: 0.5,
              }}
            />
            <div className="stats-value">{stat.value}</div>
            <div className="stats-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;
