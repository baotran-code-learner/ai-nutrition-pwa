import { useState } from 'react';
import CalorieRing from './UI_Functions/calorieRing.jsx';
import MacroBar from './UI_Functions/macroBar.jsx';

export default function App() {
  // set variables using useState from React
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [nutrition, setNutrition] = useState({ 
    targetCaloriesMin: 2700, // lower calorie goal limit
    targetCaloriesMax: 2900, // upper calorie goal limit
    currentCalories: 2800, 
    targetProtein: 150, 
    currentProtein: 120, 
    targetCarbs: 200, 
    currentCarbs: 110, 
    targetFats: 70, 
    currentFats: 45 
  });

  // Historical trend metrics data array
  const [historicalWeights] = useState([65, 66, 67 , 68, 69, 70]);
  const [weeklySummary] = useState({
    avgCalories: 2740,
    daysCompliant: 5,
    streakCount: 12
  })

  // Function that styles the clicked button
  const getButtonStyle = (screenId) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: currentScreen === screenId ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: currentScreen === screenId ? '#d33434' : '#3a18e6', fontWeight: currentScreen === screenId ? '600' : '300'
  });

  return (
    /* Design the entire screen background (excluding the main application screen) */ 
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#f4eeee', boxSizing: 'border-box' }}>

      {/* Explanation of this format: https://share.google/aimode/EWzYwZK74u5JY3O4M */}
      <div style={{ width: '100%', maxWidth: '448px', height: '100vh', maxHeight: '850px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', border: '2px solid #1e293b', boxShadow: '0 25px 50px -12px rgb(240, 233, 233)' }}>
        
        {/* Explanation of this format: https://share.google/aimode/4ssfmm23rtTWQZsMO */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', paddingBottom: '96px', position: 'relative' }}>

          {currentScreen === 'dashboard' && (
            <div id="Canvas_Dashboard" style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <header style={{ display: 'flex', flexDirection: 'column' }}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, letterSpacing: '-0.025em', color: '#ffffff' }}>Personal Dashboard</h1>
                  <button onClick={() => setCurrentScreen('details')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}>Details 🔍</button>
                </nav>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Today's nutritional overview.</p>
              </header>

              <section style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <CalorieRing current={nutrition.currentCalories} targetMin={nutrition.targetCaloriesMin} targetMax={nutrition.targetCaloriesMax} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '12px', border: '2px solid rgba(51, 65, 85, 0.6)' }}>
                  <MacroBar label="Protein" current={nutrition.currentProtein} target={nutrition.targetProtein} color="#f43f5e" />
                  <MacroBar label="Carbs" current={nutrition.currentCarbs} target={nutrition.targetCarbs} color="#0ea5e9" />
                  <MacroBar label="Fats" current={nutrition.currentFats} target={nutrition.targetFats} color="#f59e0b" />
                </div>
              </section>
              
              <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', margin: '0 4px' }}>Daily Activity Feed</h2>
                
                {/* First nutritional record example input */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>Grilled Chicken Salad</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Lunch • 12:45 PM</span>
                  </div>
                  <span style={{ fontWeight: '700', color: '#10b981', fontSize: '14px' }}>+420 kcal</span>
                </div>

                {/* Second nutritional record example input */}
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

          {/* More detail page panel */}
           {currentScreen === 'details' && (
            <div id="Canvas_Details" style={{ display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <header style={{ display: 'flex', flexDirection: 'column'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                  <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#ffffff' }}>Performance Analytics</h1>
                  <button onClick={() => setCurrentScreen('dashboard')} style={{ padding: '6px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '11px', cursor: 'pointer'}}>Close</button>
                </div>
              </header>

              {/* Organized analytical metric panels wrapped together */}
              <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '12px', border: '1px solid #334155'}}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>WEEKLY AVERAGE ENERGY</span>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
                    {weeklySummary.avgCalories} <span style={{ fontSize: '11px', color: '#64748b' }}>kcal</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>COMPLIANT DAYS</span>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginTop: '4px' }}>
                    {weeklySummary.daysCompliant} / 7 <span style={{ fontSize: '11px', color: '#64748b'}}>days</span>
                  </div>
                </div>
              </section>
            </div>
          )}
      
          {currentScreen === 'camera' && (
            <div id="Canvas_Camera" style={{ position: 'absolute', inset: 0, backgroundColor: '#020617', display: 'flex', flexDirection: 'column', zIndex: 50, fontFamily: 'sans-serif' }}>
              
              {/* Active Camera Viewport Window Frame 
              Explanation of the code: https://share.google/aimode/jbFuLmweCkVG9j11v */}
              <div style={{ flex: `1`, position: 'relative', backgroundColor: '#090d16', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Mock Camera Image Stream Placeholder Background */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #1e293b 0%, #020617 100%)' }}>
                  <span style={{ fontSize: '82px', filter: 'grayscale(30%)' }}>🥗</span>
                </div>

                {/* Futuristic Target Reticle Frame Overlay */}
                <div style={{ width: '220px', height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  
                  {/* L-Shaped Alignment Tracking Corners */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '4px solid #10b981', borderLeft: '4px solid #10b981', borderTopLeftRadius: '12px' }} />
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '4px solid #10b981', borderRight: '4px solid #10b981', borderTopRightRadius: '12px' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '4px solid #10b981', borderLeft: '4px solid #10b981', borderBottomLeftRadius: '12px' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '4px solid #10b981', borderRight: '4px solid #10b981', borderBottomRightRadius: '12px' }} />

                  {/* Animated Pulsing Vision Radar Line */}
                  <div style={{ position: 'absolute', left: '12px', right: '12px', height: '2px', backgroundColor: 'rgba(16, 185, 129, 0.7)', top: '50%', transform: 'translateY(-50%)', boxShadow: '0 0 12px #10b981' }} />
                  
                  {/* UI Overlay Help Text Box */}
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', position: 'absolute', bottom: '-40px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    Aligning Food Item...
                  </span>
                </div>

                {/* Floating System Dismiss Control Action */}
                <button 
                  onClick={() => setCurrentScreen('dashboard')} 
                  style={{ position: 'absolute', top: '15px', left: '14px', width: '40px', height: '40px', borderRadius: '60%', backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '2px solid #334155', color: '#ffffff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                >
                  ✕
                </button>
              </div>

              {/* Camera Control Deck Dock Panel */}
              <div style={{ height: '140px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 32px' }}>
                
                {/* Outer Shutter Trigger Base Structure */}
                <button 
                  onClick={() => {
                    alert("Food capture logic executed! Simulating neural network scan sequence...");
                    setCurrentScreen('dashboard');
                  }}
                  style={{ width: '76px', height: '76px', borderRadius: '50%', backgroundColor: 'transparent', border: '4px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                >
                  {/* Core Intersect Inner Shutter Core Disc */}
                  <div style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: '#f43f5e', transition: 'transform 0.15s ease' }} />
                </button>

              </div>
            </div>
          )}

          {currentScreen === 'manual entry' && (
            <div id="Canvas_Manual_Entry" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Manual Entry</h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Manually type in or custom your food</p>
            </div>
          )}
          
        </main>

        <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderTop: '2px solid rgba(51, 65, 85, 0.8)', backdropFilter: 'blur(16px)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 16px', zIndex: 10 }}>
          <button onClick={() => setCurrentScreen('dashboard')} style={getButtonStyle('dashboard')}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <span style={{ fontSize: '12px' }}>Dashboard</span>
          </button>
          <button onClick={() => setCurrentScreen('camera')} style={getButtonStyle('camera')}>
            <span style={{ fontSize: '16px' }}>📷</span>
            <span style={{ fontSize: '12px' }}>Scan Food</span>
          </button>
          <button onClick={() => setCurrentScreen('manual entry')} style={getButtonStyle('manual entry')}>
            <span style={{ fontSize: '16px' }}>📝</span>
            <span style={{ fontSize: '12px' }}>Manual Entry</span>
          </button>
        </nav>

      </div>
    </div>
  );
}