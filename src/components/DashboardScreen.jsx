import CalorieRing from '../functions/calorieRing.jsx';
import MacroBar from '../functions/macroBar.jsx';

export default function DashboardScreen({
  selectedDate,
  formatDateLabel,
  goToPreviousDate,
  goToNextDate,
  onTouchStart,
  onTouchEnd,
  nutrition,
  onRemoveActivity,
  onOpenDetails,
  onSetTouchStart
}) {
  return (
    <div
      id="Canvas_Dashboard"
      onTouchStart={(event) => onSetTouchStart(event.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
      style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', touchAction: 'pan-y' }}
    >
      <header style={{ display: 'flex', flexDirection: 'column' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, letterSpacing: '-0.025em', color: '#ffffff' }}>Personal Dashboard</h1>
          <button onClick={onOpenDetails} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}>Macro Setting 🔍</button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '10px 12px' }}>
          <button onClick={goToPreviousDate} aria-label="Previous date" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '18px', cursor: 'pointer' }}>{'<'}</button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
            <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700 }}>{formatDateLabel(selectedDate)}</span>
            <span style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{selectedDate}</span>
          </div>
          <button onClick={goToNextDate} aria-label="Next date" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '18px', cursor: 'pointer' }}>{'>'}</button>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '8px 0 0 0' }}>Swipe left or right, or use the buttons, to move between days.</p>
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

        {nutrition.activities.length > 0 ? (
          nutrition.activities.map((activity, index) => (
            <div key={`${selectedDate}-${activity.name}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{activity.name}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{activity.meal_type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: '700', color: '#10b981', fontSize: '14px' }}>+{activity.calories} kcal</span>
                <button
                  type="button"
                  onClick={() => onRemoveActivity(index, activity.__baseIndex)}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #dc2626', backgroundColor: '#7f1d1d', color: '#f8fafc', fontSize: '12px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
            No nutrition records for this date yet.
          </div>
        )}
      </section>
    </div>
  );
}
