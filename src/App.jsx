import { useState } from 'react';

function App() {
  // 1. Keep track of which screen is active
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  return (
    // 2. Main wrapper: centers the phone view on large desktop monitors
    <div className="bg-slate-900 min-h-screen md:py-8 flex justify-center items-center">

      {/* 3. The Simulated Mobile Phone Body */}
      <div className="w-full max-w-md h-screen md:h-[850px] bg-slate-900 text-white flex flex-col relative md:rounded-3xl md:shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Test */}
        <button className="absolute bottom-20 right-4 z-50">Test</button>
        
        {/* 4. Scrollable Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto pb-24">
          
          {currentScreen === 'dashboard' && (
            /* This div acts as your absolute-positioned layout panel (Canvas) */
            <div id="Canvas_Dashboard" className="relative w-full h-full">
              <h1 className="text-2xl font-bold mb-2">My Dashboard</h1>
              <p className="text-slate-400 text-sm mb-6">Today's nutritional overview.</p>
              
              {/* Proportional UI Grid elements go right here */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-700 rounded-xl">Calories: 0</div>
                <div className="p-4 bg-slate-700 rounded-xl">Protein: 0g</div>
              </div>
            </div>
          )}

          {currentScreen === 'camera' && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Food Camera</h1>
              <p className="text-slate-400 text-sm">Snap a photo of your meal.</p>
            </div>
          )}

          {currentScreen === 'history' && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Log History</h1>
              <p className="text-slate-400 text-sm">Review your past entries.</p>
            </div>
          )}
        </main>

        {/* 5. Fixed Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 h-20 bg-slate-850 border-t border-slate-700 backdrop-blur-md flex justify-around items-center px-4">
          
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex flex-col items-center gap-1 transition ${currentScreen === 'dashboard' ? 'text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-xs">📊 Dashboard</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('camera')}
            className={`flex flex-col items-center gap-1 transition ${currentScreen === 'camera' ? 'text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-xs">📷 Camera</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('history')}
            className={`flex flex-col items-center gap-1 transition ${currentScreen === 'history' ? 'text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-xs">📅 History</span>
          </button>

        </nav>
      </div>
    </div>
  );
}

export default App;