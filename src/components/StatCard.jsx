export default function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
    </div>
  );
}