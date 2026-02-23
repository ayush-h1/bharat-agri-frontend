export default function PackageCard({ pkg, onSelect }) {
  return (
    <div className={`package-card ${pkg.name === 'Gold' ? 'popular' : ''}`}>
      <h4>{pkg.name}</h4>
      <p className="price">₹{pkg.minInvestment}</p>
      <p className="daily">{pkg.dailyReturnPercent}% Daily</p>
      <button className="btn" onClick={() => onSelect(pkg)}>Select</button>
    </div>
  );
}