export default function CalorieRing({ current, targetMin, targetMax }) {
  // Check if current intake falls inside the safe zone
  const isWithinRange = current >= targetMin && current <= targetMax

  let labelText = 'KCAL REMAINING';
  let dynamicDisplayValue = Math.max(0, targetMin - current);

  if (current > targetMax) {
    labelText = 'KCAL LIMIT EXCEEDED';
    dynamicDisplayValue = current - targetMax;
  } else if (isWithinRange) {
    labelText = 'GOAL ACHIEVED!';
    dynamicDisplayValue = current; 
  }

  const percentage = Math.min(100, (current / targetMax) * 100);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '24px 0' }}>
      <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Explanantion of below code: https://share.google/aimode/PaLSzdkelBQ5eh2DR*/}
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
          <circle cx="100" cy="100" r={radius} stroke="rgba(71, 85, 105, 0.3)" strokeWidth="12" fill="transparent" />

          {/* Progress strip (swap between Blue and Red) */}
          <circle 
            cx="100" 
            cy="100" 
            r={radius} 
            stroke={isWithinRange ? '#10b981' : '#f43f5e'} 
            strokeWidth="13" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} 
          />
        </svg>

        {/* Center content text display */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.05em', color: '#ffffff' }}>
            {dynamicDisplayValue.toLocaleString()}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '0.05em', color: isWithinRange ? '#10b981' : '#94a3b8', marginTop: '5px'}}>
            {labelText}
          </span>
          <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            Target: {targetMin}-{targetMax}
          </span>
        </div>
      </div>
    </div>
  );
}