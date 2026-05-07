import "./Stats.css";

const STATS = [
  { value: "24,800+", label: "Active Experts" },
  { value: "98.2%", label: "Satisfaction Rate" },
  { value: "₹12.4M", label: "Worker Earnings" },
  { value: "15 Min", label: "Avg. Response" },
];

export default function Stats() {
  return (
    <section className="stats">
      <div className="stats__grid stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="stats__item stat-item">
            <div className="stats__value">{s.value}</div>
            <div className="stats__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
