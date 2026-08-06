import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'aiNutritionPwa_macro_goals';

const defaultGoalState = {
  rangeMin: '2700',
  rangeMax: '2900',
  mode: 'grams',
  protein: '150',
  carbs: '200',
  fats: '70'
};

// This function helps to save the macro settings into the local storage.
function parseStoredGoals() {
  if (typeof window === 'undefined') return defaultGoalState;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultGoalState;
    return { ...defaultGoalState, ...JSON.parse(saved) };
  } catch {
    return defaultGoalState;
  }
}

export default function SetMacroGoals({ onSave }) {
  const [goals, setGoals] = useState(defaultGoalState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGoals(parseStoredGoals());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const unitLabel = goals.mode === 'grams' ? 'g' : '%';
  const percentTotal = useMemo(() => {
    if (goals.mode !== 'percent') return null;
    return ['protein', 'carbs', 'fats'].reduce((sum, key) => sum + Number(goals[key] || 0), 0);
  }, [goals]);

  const updateGoal = (field, value) => {
    setGoals((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleModeChange = (mode) => {
    setGoals((prev) => ({
      ...prev,
      mode,
      protein: prev.protein || '0',
      carbs: prev.carbs || '0',
      fats: prev.fats || '0'
    }));
    setSaved(false);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        rangeMin: Number(goals.rangeMin) || 0,
        rangeMax: Number(goals.rangeMax) || 0,
        mode: goals.mode,
        protein: Number(goals.protein) || 0,
        carbs: Number(goals.carbs) || 0,
        fats: Number(goals.fats) || 0
      });
    }
    setSaved(true);
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#111827', borderRadius: '20px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#ffffff' }}>Macro Goals Setting</h1>
          <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>Choose whether your macro targets are entered as grams or percentages.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={() => handleModeChange('grams')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: goals.mode === 'grams' ? '1px solid #10b981' : '1px solid #334155',
            backgroundColor: goals.mode === 'grams' ? '#0f172a' : '#111827',
            color: '#f8fafc',
            cursor: 'pointer'
          }}
        >
          By quantity (g)
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('percent')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: goals.mode === 'percent' ? '1px solid #10b981' : '1px solid #334155',
            backgroundColor: goals.mode === 'percent' ? '#0f172a' : '#111827',
            color: '#f8fafc',
            cursor: 'pointer'
          }}
        >
          By percentage (%)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#94a3b8', fontSize: '12px', minWidth: 0 }}>
          Daily calories min
          <input
            type="number"
            min="0"
            value={goals.rangeMin}
            onChange={(event) => updateGoal('rangeMin', event.target.value)}
            style={{ padding: '12px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', outline: 'none' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#94a3b8', fontSize: '12px', minWidth: 0 }}>
          Daily calories max
          <input
            type="number"
            min="0"
            value={goals.rangeMax}
            onChange={(event) => updateGoal('rangeMax', event.target.value)}
            style={{ padding: '12px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', outline: 'none' }}
          />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {['protein', 'carbs', 'fats'].map((macro) => (
          <label key={macro} style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#94a3b8', fontSize: '12px', minWidth: 0 }}>
            {macro.charAt(0).toUpperCase() + macro.slice(1)} ({unitLabel})
            <input
              type="number"
              min="0"
              max={goals.mode === 'percent' ? '100' : undefined}
              value={goals[macro]}
              onChange={(event) => updateGoal(macro, event.target.value)}
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', outline: 'none' }}
            />
          </label>
        ))}
      </div>

      {goals.mode === 'percent' && (
        <div style={{ color: percentTotal === 100 ? '#10b981' : '#f97316', fontSize: '12px' }}>
          Total macro percentage: {percentTotal}% {percentTotal !== 100 ? '(should equal 100%)' : ''}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ color: '#94a3b8', fontSize: '12px' }}>
          Your daily calories target is {goals.rangeMin} to {goals.rangeMax} kcal.
        </div>
        <button
          type="button"
          onClick={handleSave}
          style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: '#020617', cursor: 'pointer', fontWeight: '700' }}
        >
          {saved ? 'Saved' : 'Save goals'}
        </button>
      </div>
    </section>
  );
}
