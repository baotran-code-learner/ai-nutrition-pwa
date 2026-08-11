export default function ManualEntryScreen({
  foodSearch,
  onFoodSearchChange,
  filteredSuggestions,
  onSelectSuggestion,
  customFoodName,
  onCustomFoodNameChange,
  customServingSize,
  onCustomServingSizeChange,
  customMealType,
  onCustomMealTypeChange,
  scaledProtein,
  scaledCarbs,
  scaledFats,
  previewCalories,
  onAddCustomFood,
  showMacroFallbackModal,
  onCloseMacroModal,
  macroFallbackFoodName,
  onMacroFallbackFoodNameChange,
  macroFallbackServingSize,
  onMacroFallbackServingSizeChange,
  macroFallbackProtein,
  onMacroFallbackProteinChange,
  macroFallbackCarbs,
  onMacroFallbackCarbsChange,
  macroFallbackFats,
  onMacroFallbackFatsChange,
  macroFallbackMealType,
  onMacroFallbackMealTypeChange,
  onSaveMacroEntry,
  visionScanStatus,
  visionScanResult,
  visionScanError
}) {
  return (
    <div id="Canvas_Manual_Entry" style={{ position: 'relative', width: '100%', minHeight: '100%' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, paddingBottom: '10px' }}>Manual Entry</h1>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Search for food or create a custom entry.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        {visionScanStatus !== 'idle' && (
          <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: visionScanStatus === 'failed' ? '#7f1d1d' : '#0f172a', border: `1px solid ${visionScanStatus === 'failed' ? '#991b1b' : '#334155'}` }}>
            {visionScanStatus === 'loading' && <p style={{ margin: 0, color: '#f8fafc' }}>Analyzing photo…</p>}
            {visionScanStatus === 'success' && visionScanResult && (
              <div style={{ color: '#f8fafc' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '700' }}>Food scan ready</p>
                <p style={{ margin: '0 0 6px 0' }}><strong>Name:</strong> {visionScanResult.name}</p>
                <p style={{ margin: '0 0 6px 0' }}><strong>Calories:</strong> {visionScanResult.calories} kcal</p>
                <p style={{ margin: '0 0 6px 0' }}><strong>Protein:</strong> {visionScanResult.protein} g</p>
                <p style={{ margin: 0 }}><strong>Carbs:</strong> {visionScanResult.carbs} g · <strong>Fats:</strong> {visionScanResult.fats} g</p>
              
                {visionScanResult?.items?.length > 0 && (
                  <div style={{ marginTop: '16px', backgroundColor: '#1e293b', padding: '12px', borderRadius: '10px', color: '#f8fafc' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#10b981', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Items Identified:
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px' }}>
                      {visionScanResult.items.map((item, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>
                          <strong>{item.name}</strong> {item.portion ? `(${item.portion})` : ''} — {item.calories} kcal
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          
            {visionScanStatus === 'failed' && (
              <p style={{ margin: 0, color: '#f8fafc' }}>Scan failed: {visionScanError || 'Unable to detect food from the image.'}</p>
              )}
          </div>
        )}

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
          Search food
          <input
            value={foodSearch}
            onChange={onFoodSearchChange}
            placeholder="Search or type food name"
            style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '12px', outline: 'none' }}
          />
        </label>

        {filteredSuggestions.length > 0 && (
          <div style={{ display: 'grid', gap: '8px', padding: '12px', backgroundColor: '#111827', border: '1px solid #334155', borderRadius: '16px' }}>
            {filteredSuggestions.slice(0, 5).map((food) => (
              <button
                key={food.name}
                type="button"
                onClick={() => onSelectSuggestion(food)}
                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', cursor: 'pointer' }}
              >
                <span style={{ display: 'block', fontWeight: '600' }}>{food.name}</span>
                <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>{food.meal}</span>
              </button>
            ))}
          </div>
        )}

        {showMacroFallbackModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 80 }}>
            <div style={{ width: '100%', maxWidth: '360px', backgroundColor: '#111827', border: '1px solid #334155', borderRadius: '20px', padding: '20px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Add custom macros</h2>
                <button type="button" onClick={onCloseMacroModal} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}>✕</button>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 14px 0' }}>No matching food was found. Enter macros manually and save the meal.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                  Food Name
                  <input
                    value={macroFallbackFoodName}
                    onChange={onMacroFallbackFoodNameChange}
                    placeholder="e.g. Chicken Salad"
                    style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '10px 12px', outline: 'none' }}
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                    Protein (g)
                    <input
                      type="number"
                      min="0"
                      value={macroFallbackProtein}
                      onChange={onMacroFallbackProteinChange}
                      placeholder="0"
                      style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '10px 12px', outline: 'none' }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                    Carbs (g)
                    <input
                      type="number"
                      min="0"
                      value={macroFallbackCarbs}
                      onChange={onMacroFallbackCarbsChange}
                      placeholder="0"
                      style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '10px 12px', outline: 'none' }}
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                    Fats (g)
                    <input
                      type="number"
                      min="0"
                      value={macroFallbackFats}
                      onChange={onMacroFallbackFatsChange}
                      placeholder="0"
                      style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '10px 12px', outline: 'none' }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                    Serving Size (g)
                    <input
                      type="number"
                      min="1"
                      value={macroFallbackServingSize}
                      onChange={onMacroFallbackServingSizeChange}
                      placeholder="100"
                      style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '10px 12px', outline: 'none' }}
                    />
                  </label>
                </div>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                  Meal Type
                  <select
                    value={macroFallbackMealType}
                    onChange={onMacroFallbackMealTypeChange}
                    style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '10px 12px', outline: 'none' }}
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Snack</option>
                  </select>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={onCloseMacroModal} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSaveMacroEntry}
                  style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: '#020617', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr 1fr', gap: '12px' }}>
          
          {/* 
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
            Food Name
            <input
              value={customFoodName}
              onChange={onCustomFoodNameChange}
              placeholder="e.g. Chicken Salad"
              style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '12px', outline: 'none' }}
            />
          </label>
          */}

          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
            Serving Size (g)
            <input
              type="number"
              min="1"
              value={customServingSize}
              onChange={onCustomServingSizeChange}
              placeholder="100"
              style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '12px', outline: 'none' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
            Meal Type
            <select
              value={customMealType}
              onChange={onCustomMealTypeChange}
              style={{ width: '100%', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', padding: '12px', outline: 'none' }}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '16px', backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>Protein for serving</span>
            <span style={{ fontWeight: '700', color: '#f43f5e', fontSize: '16px' }}>{scaledProtein} g</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>Carbs for serving</span>
            <span style={{ fontWeight: '700', color: '#0ea5e9', fontSize: '16px' }}>{scaledCarbs} g</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>Fats for serving</span>
            <span style={{ fontWeight: '700', color: '#f59e0b', fontSize: '16px' }}>{scaledFats} g</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #334155' }}>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Estimated energy for this custom food</span>
          <span style={{ fontWeight: '700', color: '#10b981', fontSize: '16px' }}>{previewCalories} kcal</span>
        </div>

        <button
          type="button"
          onClick={onAddCustomFood}
          style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', backgroundColor: '#10b981', color: '#020617', fontWeight: '700', cursor: 'pointer' }}
        >
          Add Food to Dashboard
        </button>
      </div>
    </div>
  );
}
