import { useMemo, useState } from 'react';
import CalorieRing from './UI_Functions/calorieRing.jsx';
import MacroBar from './UI_Functions/macroBar.jsx';

const targetNutrition = {
  targetCaloriesMin: 2700,
  targetCaloriesMax: 2900,
  targetProtein: 150,
  targetCarbs: 200,
  targetFats: 70
};

const dashboardDataByDate = {
  '2026-07-30': {
    currentCalories: 2650,
    currentProtein: 132,
    currentCarbs: 185,
    currentFats: 62,
    activities: [
      { name: 'Oatmeal and Berries', meta: 'Breakfast - 8:10 AM', calories: 390 },
      { name: 'Turkey Rice Bowl', meta: 'Lunch - 12:35 PM', calories: 610 }
    ]
  },
  '2026-07-31': {
    currentCalories: 2920,
    currentProtein: 146,
    currentCarbs: 205,
    currentFats: 74,
    activities: [
      { name: 'Egg Toast Plate', meta: 'Breakfast - 7:45 AM', calories: 480 },
      { name: 'Salmon Pasta', meta: 'Dinner - 7:20 PM', calories: 760 }
    ]
  },
  '2026-08-01': {
    currentCalories: 2800,
    currentProtein: 120,
    currentCarbs: 110,
    currentFats: 45,
    activities: [
      { name: 'Grilled Chicken Salad', meta: 'Lunch - 12:45 PM', calories: 420 },
      { name: 'Protein Shake & Banana', meta: 'Snack - 4:15 PM', calories: 310 }
    ]
  }
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric'
});

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

function formatDateLabel(dateKey) {
  return dateFormatter.format(new Date(`${dateKey}T00:00:00`));
}

function getDashboardData(dateKey) {
  return {
    ...targetNutrition,
    ...(dashboardDataByDate[dateKey] ?? {
      currentCalories: 0,
      currentProtein: 0,
      currentCarbs: 0,
      currentFats: 0,
      activities: []
    })
  };
}

export default function App() {
  // set variables using useState from React
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [touchStartX, setTouchStartX] = useState(null);
  const nutrition = useMemo(() => getDashboardData(selectedDate), [selectedDate]);

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

  const goToPreviousDate = () => setSelectedDate((date) => addDays(date, -1));
  const goToNextDate = () => setSelectedDate((date) => addDays(date, 1));

  const handleDashboardTouchEnd = (event) => {
    if (touchStartX === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > 60) {
      if (swipeDistance > 0) {
        goToPreviousDate();
      } else {
        goToNextDate();
      }
    }

    setTouchStartX(null);
  };

  return (
    /* Design the entire screen background (excluding the main application screen) */ 
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#f4eeee', boxSizing: 'border-box' }}>

      {/* This creates and styles the main container box that holds the entire mobile phone application interface
       Explanation of this format: https://share.google/aimode/EWzYwZK74u5JY3O4M */}
      <div style={{ width: '100%', maxWidth: '448px', height: '100vh', maxHeight: '850px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', border: '4px solid #1e293b', boxShadow: '0 25px 50px -12px rgb(240, 233, 233)' }}>
        
        {/* Explanation of this format: https://share.google/aimode/4ssfmm23rtTWQZsMO */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', paddingBottom: '100px', position: 'relative' }}>

          {currentScreen === 'dashboard' && (
            <div
              id="Canvas_Dashboard"
              onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
              onTouchEnd={handleDashboardTouchEnd}
              style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', touchAction: 'pan-y' }}
            >

              <header style={{ display: 'flex', flexDirection: 'column' }}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, letterSpacing: '-0.025em', color: '#ffffff' }}>Personal Dashboard</h1>
                  <button onClick={() => setCurrentScreen('details')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}>Details 🔍</button>
                </nav>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '10px 12px' }}>
                  <button onClick={goToPreviousDate} aria-label="Previous date" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '18px', cursor: 'pointer' }}>
                    {'<'}
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                    <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700 }}>{formatDateLabel(selectedDate)}</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{selectedDate}</span>
                  </div>
                  <button onClick={goToNextDate} aria-label="Next date" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '18px', cursor: 'pointer' }}>
                    {'>'}
                  </button>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '8px 0 0 0' }}>Swipe left or right, or use the buttons, to move between days.</p>
              </header>

              {/* Design the total kcals and macronutrition bars */}
              <section style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <CalorieRing current={nutrition.currentCalories} targetMin={nutrition.targetCaloriesMin} targetMax={nutrition.targetCaloriesMax} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '12px', border: '2px solid rgba(51, 65, 85, 0.6)' }}>
                  <MacroBar label="Protein" current={nutrition.currentProtein} target={nutrition.targetProtein} color="#f43f5e" />
                  <MacroBar label="Carbs" current={nutrition.currentCarbs} target={nutrition.targetCarbs} color="#0ea5e9" />
                  <MacroBar label="Fats" current={nutrition.currentFats} target={nutrition.targetFats} color="#f59e0b" />
                </div>
              </section>
              
              {/* Display nutrition records */}
              <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', margin: '0 4px' }}>Daily Activity Feed</h2>
              
                {nutrition.activities.length > 0 ? (
                  nutrition.activities.map((activity) => (
                    <div key={`${selectedDate}-${activity.name}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{activity.name}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{activity.meta}</span>
                      </div>
                      <span style={{ fontWeight: '700', color: '#10b981', fontSize: '14px' }}>+{activity.calories} kcal</span>
                    </div>
                  ))
                ) : (
                  <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
                    No nutrition records for this date yet.
                  </div>
                )}
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

                <div style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>LATEST WEIGHT</span>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
                    {historicalWeights[historicalWeights.length - 1]} <span style={{ fontSize: '11px', color: '#64748b'}}>kg</span>
                  </div>
                </div>
              </section>

            </div>
          )}
      
          {currentScreen === 'camera' && (
            <div id="Canvas_Camera" style={{ position: 'absolute', inset: 0, backgroundColor: '#020617', display: 'flex', flexDirection: 'column', zIndex: 50, fontFamily: 'sans-serif' }}>
              
              {/* Active Camera Viewport Window Frame 
              Explanation of the code: https://share.google/aimode/jbFuLmweCkVG9j11v */}
              <div style={{ flex: `1`, position: 'relative', backgroundColor: '#141516', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
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

              {/* Camera Record Button Deck Dock Panel */}
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
              <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, paddingBottom: '10px'}}>Manual Entry</h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Manually type in or custom your food</p>
            </div>
          )}
        
        </main>

        {/* Style the dashboard navigation bar */}
        <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderTop: '2px solid rgba(51, 65, 85, 0.8)', backdropFilter: 'blur(16px)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 10px', zIndex: 10 }}>
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
