export default function CameraScreen({ onClose }) {
  return (
    <div id="Canvas_Camera" style={{ position: 'absolute', inset: 0, backgroundColor: '#020617', display: 'flex', flexDirection: 'column', zIndex: 50, fontFamily: 'sans-serif' }}>
      <div style={{ flex: '1', position: 'relative', backgroundColor: '#141516', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #1e293b 0%, #020617 100%)' }}>
          <span style={{ fontSize: '82px', filter: 'grayscale(30%)' }}>🥗</span>
        </div>

        <div style={{ width: '220px', height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '4px solid #10b981', borderLeft: '4px solid #10b981', borderTopLeftRadius: '12px' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '4px solid #10b981', borderRight: '4px solid #10b981', borderTopRightRadius: '12px' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '4px solid #10b981', borderLeft: '4px solid #10b981', borderBottomLeftRadius: '12px' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '4px solid #10b981', borderRight: '4px solid #10b981', borderBottomRightRadius: '12px' }} />
          <div style={{ position: 'absolute', left: '12px', right: '12px', height: '2px', backgroundColor: 'rgba(16, 185, 129, 0.7)', top: '50%', transform: 'translateY(-50%)', boxShadow: '0 0 12px #10b981' }} />
          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', position: 'absolute', bottom: '-40px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            Aligning Food Item...
          </span>
        </div>

        <button onClick={onClose} style={{ position: 'absolute', top: '15px', left: '14px', width: '40px', height: '40px', borderRadius: '60%', backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '2px solid #334155', color: '#ffffff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}>
          ✕
        </button>
      </div>

      <div style={{ height: '140px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 32px' }}>
        <button
          onClick={() => {
            alert('Food capture logic executed! Simulating neural network scan sequence...');
            onClose();
          }}
          style={{ width: '76px', height: '76px', borderRadius: '50%', backgroundColor: 'transparent', border: '4px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
        >
          <div style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: '#f43f5e', transition: 'transform 0.15s ease' }} />
        </button>
      </div>
    </div>
  );
}
