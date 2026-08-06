import SetMacroGoals from './setMacroGoals.jsx';

export default function DetailsScreen({ weeklySummary, historicalWeights, onClose }) {
  return (
    <div id="Canvas_Details" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/*
      <header style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#ffffff' }}>Performance Analytics</h1>
          <button onClick={onClose} style={{ padding: '6px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '11px', cursor: 'pointer' }}>Close</button>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>WEEKLY AVERAGE ENERGY</span>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
            {weeklySummary.avgCalories} <span style={{ fontSize: '11px', color: '#64748b' }}>kcal</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>COMPLIANT DAYS</span>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginTop: '4px' }}>
            {weeklySummary.daysCompliant} / 7 <span style={{ fontSize: '11px', color: '#64748b' }}>days</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>LATEST WEIGHT</span>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
            {historicalWeights[historicalWeights.length - 1]} <span style={{ fontSize: '11px', color: '#64748b' }}>kg</span>
          </div>
        </div>
      </section>
       */}
      
      <SetMacroGoals/>
    </div>
  );
}
