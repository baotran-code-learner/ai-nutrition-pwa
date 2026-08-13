export default function ManualEntryScreen({
  foodSearch,
  onFoodSearchChange,
  filteredSuggestions = [],
  onSelectSuggestion,
  customFoodName,
  onCustomFoodNameChange,
  customServingSize,
  onCustomServingSizeChange,
  customMealType,
  onCustomMealTypeChange,
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
  const currentInputValue = foodSearch || customFoodName || '';

  return (
    <div id="Canvas_Manual_Entry" style={{ position: 'relative', width: '100%', minHeight: '100%' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, paddingBottom: '10px' }}>Manual Entry</h1>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Search for food or create a custom entry.</p>

      {/* Vision AI Scan Results Section */}
      {visionScanStatus !== 'idle' && (
        <div style={{
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: visionScanStatus === 'failed' ? '#7f1d1d' : '#0f172a',
          border: `1px solid ${visionScanStatus === 'failed' ? '#991b1b' : '#334155'}`,
          marginTop: '16px'
        }}>
          {visionScanStatus === 'loading' && <p style={{ margin: 0, color: '#f8fafc' }}>Analyzing photo…</p>}
          
          {visionScanStatus === 'success' && visionScanResult && (
            <div>
              <p style={{ margin: '0 0 12px 0', fontWeight: '700', color: '#10b981', fontSize: '16px' }}>
                Items Identified:
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(visionScanResult?.items || []).map((item, index) => {
                  const serving = item.serving_size_g ?? item.serving_size ?? item.portion ?? 0;
                  const carbs = item.carbs_g ?? item.carbs ?? 0;
                  const protein = item.protein_g ?? item.protein ?? 0;
                  const fats = item.fat_g ?? item.fats_g ?? item.fats ?? item.fat ?? 0;

                  return (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        padding: '12px',
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        border: '1px solid #334155'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: '#f8fafc' }}>
                          {item.name} — {serving}g
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                          Carbs: {carbs}g | Protein: {protein}g | Fat: {fats}g
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onAddCustomFood(
                            {
                              foodName: item.name,
                              servingSize: serving,
                              protein: protein,
                              carbs: carbs,
                              fats: fats,
                              mealType: customMealType
                            },
                            index
                          )
                        }
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Add
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {visionScanStatus === 'failed' && (
            <p style={{ margin: 0, color: '#f8fafc' }}>Scan failed: {visionScanError || 'Unable to detect food from the image.'}</p>
          )}
        </div>
      )}

      {/* Manual Search & Custom Food Form */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Search food</label>
          <input
            type="text"
            value={currentInputValue}
            onChange={(e) => {
              onFoodSearchChange(e);
              onCustomFoodNameChange(e);
            }}
            placeholder="Search or type food name"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              color: '#f8fafc',
              boxSizing: 'border-box'
            }}
          />

          {/* Autocomplete Dropdown List */}
          {filteredSuggestions.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              listStyle: 'none',
              padding: 0,
              margin: '4px 0 0 0',
              maxHeight: '180px',
              overflowY: 'auto',
              zIndex: 10
            }}>
              {filteredSuggestions.map((food, idx) => (
                <li
                  key={idx}
                  onClick={() => onSelectSuggestion(food)}
                  style={{
                    padding: '10px 12px',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    borderBottom: '1px solid #334155',
                    fontSize: '14px'
                  }}
                >
                  {food.name} ({food.calories} kcal)
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Serving Size (g)</label>
            <input
              type="number"
              value={customServingSize}
              onChange={onCustomServingSizeChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#f8fafc',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Meal Type</label>
            <select
              value={customMealType}
              onChange={onCustomMealTypeChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#f8fafc',
                boxSizing: 'border-box'
              }}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAddCustomFood({ foodName: currentInputValue })}
          style={{
            width: '100%',
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Add Food to Dashboard
        </button>
      </div>
    </div>
  );
}