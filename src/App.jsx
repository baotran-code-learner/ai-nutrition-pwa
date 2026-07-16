import { useState } from 'react';

// PHASE 3: Central Calorie Ring UI Widget
function CalorieRing({ current, target }) {
  const remaining = Math.max(0, target - current);
  const percentage = Math.min(100, (current / target) * 100);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '24px 0' }}>
      <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
          <circle cx="100" cy="100" r={radius} stroke="rgba(71, 85, 105, 0.3)" strokeWidth="12" fill="transparent" />
          <circle cx="100" cy="100" r={radius} stroke={current > target ? '#f43f5e' : '#10b981'} strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.05em', color: '#ffffff' }}>{remaining.toLocaleString()}</span>
          <span style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '0.05em', color: '#94a3b8', marginTop: '4px' }}>{current > target ? 'KCAL OVER' : 'KCAL REMAINING'}</span>
        </div>
      </div>
    </div>
  );
}

// PHASE 4: Macronutrient Linear Bars Widget
function MacroBar({ label, current, target, color }) {
  const percentage = Math.min(100, (current / target) * 100);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>{current}g <span style={{ fontSize: '12px', fontWeight: '400', color: '#64748b' }}>/ {target}g</span></span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <div style={{ height: '100%', backgroundColor: color, width: `${percentage}%`, transition: 'width 0.5s ease-out' }} />
      </div>
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [nutrition] = useState({ targetCalories: 2000, currentCalories: 1350, targetProtein: 150, currentProtein: 95, targetCarbs: 200, currentCarbs: 110, targetFats: 70, currentFats: 45 });

  const getButtonStyle = (screenId) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: currentScreen === screenId ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: currentScreen === screenId ? '#34d399' : '#94a3b8', fontWeight: currentScreen === screenId ? '600' : '400'
  });

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#ffffff', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '448px', height: '100vh', maxHeight: '850px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', paddingBottom: '96px', position: 'relative' }}>
          {currentScreen === 'dashboard' && (
            <div id="Canvas_Dashboard" style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <header style={{ display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, letterSpacing: '-0.025em', color: '#ffffff' }}>My Dashboard</h1>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Today's nutritional overview.</p>
              </header>
              <section style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <CalorieRing current={nutrition.currentCalories} target={nutrition.targetCalories} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.6)' }}>
                  <MacroBar label="Protein" current={nutrition.currentProtein} target={nutrition.targetProtein} color="#f43f5e" />
                  <MacroBar label="Carbs" current={nutrition.currentCarbs} target={nutrition.targetCarbs} color="#0ea5e9" />
                  <MacroBar label="Fats" current={nutrition.currentFats} target={nutrition.targetFats} color="#f59e0b" />
                </div>
              </section>
              <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', margin: '0 4px' }}>Daily Activity Feed</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>Grilled Chicken Salad</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Lunch • 12:45 PM</span>
                  </div>
                  <span style={{ fontWeight: '700', color: '#10b981', fontSize: '14px' }}>+420 kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>Protein Shake & Banana</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Snack • 4:15 PM</span>
                  </div>
                  <span style={{ fontWeight: '700', color: '#10b981', fontSize: '14px' }}>+310 kcal</span>
                </div>
              </section>
            </div>
          )}
          {currentScreen === 'camera' && (
            <div id="Canvas_Camera" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Food Camera</h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Snap a photo of your meal.</p>
            </div>
          )}
          {currentScreen === 'history' && (
            <div id="Canvas_History" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Log History</h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Review your past entries.</p>
            </div>
          )}
        </main>

        <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid rgba(51, 65, 85, 0.8)', backdropFilter: 'blur(16px)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 16px', zIndex: 10 }}>
          <button onClick={() => setCurrentScreen('dashboard')} style={getButtonStyle('dashboard')}><span style={{ fontSize: '16px' }}>📊</span><span style={{ fontSize: '12px' }}>Dashboard</span></button>
          <button onClick={() => setCurrentScreen('camera')} style={getButtonStyle('camera')}><span style={{ fontSize: '16px' }}>📷</span><span style={{ fontSize: '12px' }}>Camera</span></button>
          <button onClick={() => setCurrentScreen('history')} style={getButtonStyle('history')}><span style={{ fontSize: '16px' }}>📅</span><span style={{ fontSize: '12px' }}>History</span></button>
        </nav>

      </div>
    </div>
  );
}
