import React, { useState, useEffect, useRef } from 'react';

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
  scaledProtein = 0,
  scaledCarbs = 0,
  scaledFats = 0,
  previewCalories = 0,
  onAddCustomFood,
  showMacroFallbackModal,
  openMacroFallbackModal,
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
  visionScanStatus = 'idle',
  visionScanResult,
  visionScanError
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentInputValue = foodSearch || customFoodName || '';

  // Close dropdown automatically when clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (food) => {
    onSelectSuggestion(food);
    setIsDropdownOpen(false);
  };

  const handleCustomFoodClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);

    const nameToUse = currentInputValue.trim();
    if (typeof openMacroFallbackModal === 'function') {
      openMacroFallbackModal(nameToUse);
    }
  };

  return (
    <div
      id="Canvas_Manual_Entry"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100%',
        boxSizing: 'border-box'
      }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, paddingBottom: '6px', color: '#f8fafc' }}>
        Manual Entry
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0' }}>
        Search for food or add a custom entry.
      </p>

      {/* Vision AI Scan Results Section */}
      {visionScanStatus !== 'idle' && (
        <div
          style={{
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: visionScanStatus === 'failed' ? '#7f1d1d' : '#0f172a',
            border: `1px solid ${visionScanStatus === 'failed' ? '#991b1b' : '#334155'}`,
            marginBottom: '20px'
          }}
        >
          {visionScanStatus === 'loading' && <p style={{ margin: 0, color: '#f8fafc' }}>Analyzing photo…</p>}

          {visionScanStatus === 'success' && visionScanResult && (
            <div>
              <p style={{ margin: '0 0 12px 0', fontWeight: '700', color: '#10b981', fontSize: '16px' }}>
                Items Identified:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(visionScanResult?.items || []).map((item, index) => {
                  // Extract numeric grams if AI returned a string like "150g" or "1 serving"
                  const rawServing = item.serving_size_g ?? item.serving_size ?? item.portion;
                  const servingGrams = typeof rawServing === 'number'
                    ? rawServing
                    : parseInt(String(rawServing || '').replace(/\D/g, ''), 10) || 100;

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
                          {item.name} — {serving}
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
                              protein,
                              carbs,
                              fats,
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
            <p style={{ margin: 0, color: '#f8fafc' }}>
              Scan failed: {visionScanError || 'Unable to detect food.'}
            </p>
          )}
        </div>
      )}

      {/* Main Search and Input Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div ref={dropdownRef} style={{ position: 'relative', zIndex: 30 }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>
            Search food
          </label>
          <input
            type="text"
            value={currentInputValue}
            onChange={(e) => {
              onFoodSearchChange(e);
              if (onCustomFoodNameChange) onCustomFoodNameChange(e);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search or type food name"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              color: '#f8fafc',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          {/* Search Dropdown */}
          {isDropdownOpen && currentInputValue.trim().length > 0 && (
            <ul
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                maxHeight: '220px',
                overflowY: 'auto',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.7)',
                zIndex: 50
              }}
            >

              {filteredSuggestions.map((food, idx) => {
                const p = food.protein ?? 0;
                const c = food.carbs ?? 0;
                const f = food.fats ?? food.fat ?? 0;
                const kcal = food.calories ?? Math.round(p * 4 + c * 4 + f * 9);

                return (
                  <li
                    key={idx}
                    onMouseDown={(e) => {
                      // 1. Prevent input blur from firing before selection completes
                      e.preventDefault();
                      // 2. Trigger the selection callback
                      onSelectSuggestion(food);
                    }}
                    style={{
                      padding: '12px 14px',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      borderBottom: '1px solid #334155',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{food.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>{kcal} kcal</span> (100g) —{' '}
                      <span style={{ color: '#f43f5e' }}>P: {p}g</span> |{' '}
                      <span style={{ color: '#0ea5e9' }}>C: {c}g</span> |{' '}
                      <span style={{ color: '#f59e0b' }}>F: {f}g</span>
                    </div>
                  </li>
                );
              })}

              {/* Custom Food Action */}
              <li
                onClick={handleCustomFoodClick}
                style={{
                  padding: '14px',
                  color: '#10b981',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: '#0f172a',
                  fontSize: '14px',
                  borderTop: filteredSuggestions.length > 0 ? '1px solid #334155' : 'none'
                }}
              >
                ➕ Custom Food: Click to manually enter macros for "{currentInputValue}"
              </li>
            </ul>
          )}
        </div>

        {/* Portion and Meal Type Options */}
        <div style={{ display: 'flex', gap: '12px', zIndex: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>
              Serving Size (g)
            </label>
            <input
              type="number"
              value={customServingSize}
              onChange={onCustomServingSizeChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#f8fafc',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>
              Meal Type
            </label>
            <select
              value={customMealType}
              onChange={onCustomMealTypeChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#f8fafc',
                fontSize: '15px',
                outline: 'none',
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

        {/* 🟢 Macro Summary Preview Box (HIDDEN when AI Vision scan is active) 
        visionScanStatus === 'idle' && */ }
        {(scaledProtein > 0 || scaledCarbs > 0 || scaledFats > 0 || previewCalories > 0) && (
          <div
            style={{
              backgroundColor: '#0f172a',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #334155'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                marginBottom: '10px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}
            >
              MACRO SUMMARY FOR {customServingSize || 100}g:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Calories</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', marginTop: '2px' }}>
                  {previewCalories} kcal
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Protein</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f43f5e', marginTop: '2px' }}>
                  {scaledProtein}g
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Carbs</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0ea5e9', marginTop: '2px' }}>
                  {scaledCarbs}g
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Fat</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b', marginTop: '2px' }}>
                  {scaledFats}g
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🟢 Main "Add Food to Dashboard" Button: Shows whenever a food item is selected */}
        {(scaledProtein > 0 || scaledCarbs > 0 || scaledFats > 0 || previewCalories > 0) && (
          <button
            type="button"
            onClick={() => {
              onAddCustomFood({ foodName: currentInputValue });
            }}
            style={{
              width: '100%',
              backgroundColor: '#10b981',
              color: '#020617',
              border: 'none',
              padding: '14px',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            Add Food to Dashboard
          </button>
        )}
        
      </div>

      {/* CUSTOM MACRO POPUP MODAL */}
      {showMacroFallbackModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '20px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                Enter Custom Food Details
              </h2>
              <button
                type="button"
                onClick={onCloseMacroModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>
                Food Name
              </label>
              <input
                type="text"
                value={macroFallbackFoodName}
                onChange={onMacroFallbackFoodNameChange}
                placeholder="e.g. Homemade Chicken Soup"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>
                  Serving (g)
                </label>
                <input
                  type="number"
                  value={macroFallbackServingSize}
                  onChange={onMacroFallbackServingSizeChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>
                  Meal Type
                </label>
                <select
                  value={macroFallbackMealType}
                  onChange={onMacroFallbackMealTypeChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', color: '#f43f5e', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  Protein (g)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={macroFallbackProtein}
                  onChange={onMacroFallbackProteinChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#0ea5e9', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  Carbs (g)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={macroFallbackCarbs}
                  onChange={onMacroFallbackCarbsChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#f59e0b', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  Fat (g)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={macroFallbackFats}
                  onChange={onMacroFallbackFatsChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={onCloseMacroModal}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSaveMacroEntry}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#10b981',
                  color: '#020617',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Save & Add Food
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}