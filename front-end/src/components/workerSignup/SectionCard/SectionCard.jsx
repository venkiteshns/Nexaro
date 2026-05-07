export default function SectionCard({ icon, title, children }) {
  return (
    <div className="ws-section">
      <div className="ws-section__header">
        <div className="ws-section__icon">{icon}</div>
        <h3 className="ws-section__title">{title}</h3>
      </div>
      {children}
    </div>
  );
}
