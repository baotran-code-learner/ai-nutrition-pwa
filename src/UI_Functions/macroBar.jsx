// Macronutrient Linear Bars Widget
export default function MacroBar({ label, current, target, color }) {
  const percentage = Math.min(100, (current / target) * 100);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
          {current}g 
          <span style={{ fontSize: '12px', fontWeight: '400', color: '#64748b' }}>
            / {target}g
          </span>
        </span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <div style={{ height: '100%', backgroundColor: color, width: `${percentage}%`, transition: 'width 0.4s ease-out' }} />
      </div>
    </div>
  );
}