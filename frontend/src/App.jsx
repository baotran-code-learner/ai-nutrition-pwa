import { useEffect, useMemo, useState } from 'react';
import DashboardScreen from './components/DashboardScreen.jsx';
import DetailsScreen from './components/detailsScreen/DetailsScreen.jsx';
import CameraScreen from './components/CameraScreen.jsx';
import FoodAnalyzer from './components/FoodAnalyzer.jsx';
import ManualEntryScreen from './components/ManualEntryScreen.jsx';
import dashboardDataByDate from '../data/dashboardDataByDate.js';
import foodData from '../data/foodData.js';

const targetNutrition = {
  targetCaloriesMin: 2700,
  targetCaloriesMax: 2900,
  targetProtein: 150,
  targetCarbs: 200,
  targetFats: 70
};

function calculateCalories(protein = 0, carbs = 0, fats = 0) {
  return Math.round((Number(protein) || 0) * 4 + (Number(carbs) || 0) * 4 + (Number(fats) || 0) * 9);
}

/* This function combines target and current nutrition value and return 0 if no current calorie values are stored */
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

// Format the date as Weekday and Month as words and Day as number format.
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric'
});

/* This function converts a JavaScript Date object into a local YYYY-MM-DD string. 
String(date.getMonth() + 1) add one since the month format starts with 0. */
function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/* This function creates a variable "date" that converts date string into JavaScript calculatable value
"new" helps to set the Date into an object instead of a string so that we can use .setDate: set a date; or .getDate: get the days of the month */
function changeDays(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

// This function creates a user friendly date format
function formatDateLabel(dateKey) {
  return dateFormatter.format(new Date(`${dateKey}T00:00:00`));
}

const LOCAL_STORAGE_SELECTED_DATE = 'aiNutritionPwa_selectedDate';
const LOCAL_STORAGE_CUSTOM_ENTRIES = 'aiNutritionPwa_customEntriesByDate';
const LOCAL_STORAGE_REMOVED_BASE = 'aiNutritionPwa_removedBaseActivitiesByDate';


export default function App() {
  // set variables using useState from React
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(() => {
    if (typeof window === 'undefined') return toDateKey(new Date());
    return window.localStorage.getItem(LOCAL_STORAGE_SELECTED_DATE) || toDateKey(new Date());
  });
  const [touchStartX, setTouchStartX] = useState(null);

  // Historical trend metrics data array
  const [historicalWeights] = useState([68, 69, 70]);
  const [weeklySummary] = useState({
    avgCalories: 2740,
    daysCompliant: 5,
    streakCount: 12
  });

  const [customEntriesByDate, setCustomEntriesByDate] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CUSTOM_ENTRIES)) || {};
    } catch {
      return {};
    }
  });

  const [removedBaseActivitiesByDate, setRemovedBaseActivitiesByDate] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_REMOVED_BASE)) || {};
    } catch {
      return {};
    }
  });

  const [foodSearch, setFoodSearch] = useState('');
  const [customFoodName, setCustomFoodName] = useState('');
  const [customServingSize, setCustomServingSize] = useState('100');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFats, setCustomFats] = useState('');
  const [customMealType, setCustomMealType] = useState('Breakfast');

  // Controls whether the popup is visible
  const [showMacroFallbackModal, setShowMacroFallbackModal] = useState(false);
  // Stores the food name typed into the popup
  const [macroFallbackFoodName, setMacroFallbackFoodName] = useState('');
  // Stores the serving size value for that popup entry
  const [macroFallbackServingSize, setMacroFallbackServingSize] = useState('100');

  // Stores the macro values the user enters
  const [macroFallbackProtein, setMacroFallbackProtein] = useState('');
  const [macroFallbackCarbs, setMacroFallbackCarbs] = useState('');
  const [macroFallbackFats, setMacroFallbackFats] = useState('');

  // Stores the selected meal category for that popup entry
  const [macroFallbackMealType, setMacroFallbackMealType] = useState('Snack');
  const [visionScanStatus, setVisionScanStatus] = useState('idle');
  const [visionScanResult, setVisionScanResult] = useState(null);
  const [visionScanError, setVisionScanError] = useState('');

  /* useEffect runs side effects after render, such as saving data to localStorage. 
  try/catch is used to handling unexpected runtime errors safely to avoid crashing the app*/  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LOCAL_STORAGE_CUSTOM_ENTRIES, JSON.stringify(customEntriesByDate));
    } catch {
      // ignore write errors
    }
  }, [customEntriesByDate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LOCAL_STORAGE_REMOVED_BASE, JSON.stringify(removedBaseActivitiesByDate));
    } catch {
      // ignore write errors
    }
  }, [removedBaseActivitiesByDate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LOCAL_STORAGE_SELECTED_DATE, selectedDate);
    } catch {
      // ignore write errors
    }
  }, [selectedDate]);


  const todaysBaseActivitiesRaw = dashboardDataByDate[selectedDate]?.activities ?? [];
  const todaysRemovedBaseIndexes = removedBaseActivitiesByDate[selectedDate] ?? [];
  const todaysBaseActivities = todaysBaseActivitiesRaw
    .map((activity, index) => ({ ...activity, __baseIndex: index }))
    .filter((activity) => !todaysRemovedBaseIndexes.includes(activity.__baseIndex));
  const todaysCustomActivities = customEntriesByDate[selectedDate] ?? [];

  const nutrition = useMemo(() => {
    const base = dashboardDataByDate[selectedDate] ?? {
      currentCalories: 0,
      currentProtein: 0,
      currentCarbs: 0,
      currentFats: 0,
      activities: []
    };

    /* .reduce aggregates the custom activities for today into a single totals object. In another word, it adds up all the calories, protein, carbs, and fats value. 
    Example and more information on the array.reduce(accumulator, currentValue, index, array): https://share.gemini.google/VZLKg2qtEOMI */
    const customTotals = todaysCustomActivities.reduce((totals, activity) => ({
      calories: totals.calories + (activity.calories || 0),
      protein: totals.protein + (activity.protein || 0),
      carbs: totals.carbs + (activity.carbs || 0),
      fats: totals.fats + (activity.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const baseCalories = todaysBaseActivities.reduce((sum, activity) => sum + (activity.calories || 0), 0);

    return {
      ...targetNutrition,
      ...base,
      currentCalories: baseCalories + customTotals.calories,
      currentProtein: (base.currentProtein || 0) + customTotals.protein,
      currentCarbs: (base.currentCarbs || 0) + customTotals.carbs,
      currentFats: (base.currentFats || 0) + customTotals.fats,
      activities: [...todaysBaseActivities, ...todaysCustomActivities]
    };
  }, [selectedDate, todaysCustomActivities, todaysBaseActivities]);

  const servingSizeMultiplier = (Number(customServingSize) || 0) / 100;
  const scaledProtein = Math.round((Number(customProtein) || 0) * servingSizeMultiplier);
  const scaledCarbs = Math.round((Number(customCarbs) || 0) * servingSizeMultiplier);
  const scaledFats = Math.round((Number(customFats) || 0) * servingSizeMultiplier);
  const previewCalories = calculateCalories(scaledProtein, scaledCarbs, scaledFats);

  /* .filter loops through the array and return a new filtered array 
  More information: https://claude.ai/share/f4bf4a02-ed38-4291-aa44-89ad630954ee */
  const filteredSuggestions = foodData.filter((food) => {
    const query = foodSearch.trim().toLowerCase();
    return query.length > 0 && food.name.toLowerCase().includes(query);
  });

  const resetManualForm = () => {
    setFoodSearch('');
    setCustomFoodName('');
    setCustomServingSize('100');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFats('');
    setCustomMealType('Breakfast');
    setShowMacroFallbackModal(false);
    setMacroFallbackFoodName('');
    setMacroFallbackServingSize('100');
    setMacroFallbackProtein('');
    setMacroFallbackCarbs('');
    setMacroFallbackFats('');
    setMacroFallbackMealType('Snack');
  };

  const openMacroFallbackModal = (initialName = '') => {
    setMacroFallbackFoodName(initialName || foodSearch.trim() || customFoodName.trim() || '');
    setMacroFallbackServingSize(customServingSize || '100');
    setMacroFallbackProtein(customProtein || '');
    setMacroFallbackCarbs(customCarbs || '');
    setMacroFallbackFats(customFats || '');
    setMacroFallbackMealType(customMealType);
    setShowMacroFallbackModal(true);
  };

  const handleFoodSearchChange = (event) => {
    const nextValue = event.target.value;
    setFoodSearch(nextValue);

    const query = nextValue.trim().toLowerCase();
    const hasMatches = foodData.some((food) => food.name.toLowerCase().includes(query));

    if (query.length === 0) {
      setShowMacroFallbackModal(false);
      return;
    }

    if (!hasMatches && !showMacroFallbackModal) {
      openMacroFallbackModal(nextValue.trim());
    } else if (hasMatches) {
      setShowMacroFallbackModal(false);
    }
  };

  const clearVisionScan = () => {
    setVisionScanStatus('idle');
    setVisionScanResult(null);
    setVisionScanError('');
  };

  const parseDataUrl = (dataUrl) => {
    const matches = /^data:(.+);base64,(.+)$/.exec(dataUrl);
    if (!matches) {
      throw new Error('Invalid image data URL.');
    }
    return { mimeType: matches[1], base64Data: matches[2] };
  };

  const fetchFoodVisionNutrition = async (photoDataUrl) => {
    const apiUrl = import.meta.env.VITE_FOOD_VISION_API_URL || '/api/analyze-food';
    const { mimeType, base64Data } = parseDataUrl(photoDataUrl);

    const response = await fetch('https://ai-nutrition-pwa.onrender.com/api/analyze-food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ base64Data, mimeType })
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Food vision API error: ${message}`);
    }

    return response.json();
  };

  const normalizeVisionResult = (result) => {
    const totalNutrition = result.total_nutrition ?? result; //
    const name = String(
      result.name || result.food_name || result.label || result.items?.[0]?.name || 'Scanned food'
    ).trim(); //

    // Preserve ingredient breakdown items
    const items = Array.isArray(result.items)
      ? result.items.map((item) => ({
          name: String(item.name || 'Item'),
          portion: String(item.portion || '1 serving'),
          calories: Number(item.calories ?? 0),
          protein: Number(item.protein ?? item.protein_g ?? 0),
          carbs: Number(item.carbs ?? item.carbs_g ?? 0),
          fats: Number(item.fats ?? item.fat ?? item.fat_g ?? 0)
        }))
      : [];

    return {
      name,
      protein: Number(result.protein ?? totalNutrition?.protein_g ?? totalNutrition?.protein ?? 0), //
      carbs: Number(result.carbs ?? totalNutrition?.carbs_g ?? totalNutrition?.carbs ?? 0), //
      fats: Number(result.fats ?? result.fat ?? totalNutrition?.fat_g ?? totalNutrition?.fats ?? 0), //
      serving_size_g: Number(result.serving_size_g ?? result.serving_size ?? 100), //
      calories: Number(result.calories ?? totalNutrition?.calories ?? calculateCalories(result.protein, result.carbs, result.fats)), //
      items
    };
  };

  const handlePhotoCaptured = async (photoDataUrl) => {
    setVisionScanStatus('loading');
    setVisionScanError('');
    setVisionScanResult(null);
    
    // Navigate directly to manual entry screen
    setCurrentScreen('manual entry');

    try {
      const apiResult = await fetchFoodVisionNutrition(photoDataUrl);
      const normalized = normalizeVisionResult(apiResult);
      
      setVisionScanResult(normalized);
      setCustomFoodName(normalized.name);
      setCustomProtein(String(normalized.protein));
      setCustomCarbs(String(normalized.carbs));
      setCustomFats(String(normalized.fats));
      setCustomServingSize(String(normalized.serving_size_g));
      setVisionScanStatus('success');
    } catch (err) {
      console.error(err);
      setVisionScanError(err.message || 'Unable to analyze the photo.');
      setVisionScanStatus('failed');
    }
  };

  // This is a function that display all the information of the selected food item.
  const handleSelectSuggestion = (food) => {
    setCustomFoodName(food.name);
    setCustomServingSize('100');
    setCustomProtein(String(food.protein));
    setCustomCarbs(String(food.carbs));
    setCustomFats(String(food.fats));
    setCustomMealType(food.meal);
    setFoodSearch(food.name);
    setShowMacroFallbackModal(false);
  };

  const handleAddCustomFood = (overrides = {}, itemIndex = null) => {
    const foodName = String(
      overrides.foodName ?? customFoodName ?? foodSearch ?? ''
    ).trim();

    if (!foodName) {
      alert('Enter a food name before adding it.');
      return;
    }

    // Duplicate check
    const currentDayEntries = customEntriesByDate[selectedDate] || [];
    const isDuplicate = currentDayEntries.some(
      (entry) => entry.name.toLowerCase() === foodName.toLowerCase()
    );

    if (isDuplicate) {
      alert(`"${foodName}" has already been added to your log for today.`);
      return;
    }

    const servingSizeValue = overrides.servingSize ?? customServingSize ?? 100;
    const protein = Number(overrides.protein ?? scaledProtein ?? 0);
    const carbs = Number(overrides.carbs ?? scaledCarbs ?? 0);
    const fats = Number(overrides.fats ?? scaledFats ?? 0);
    const mealTypeValue = overrides.mealType ?? customMealType ?? 'Breakfast';
    const calories = overrides.calories ?? Math.round(protein * 4 + carbs * 4 + fats * 9);

    const activity = {
      name: foodName,
      meal_type: mealTypeValue,
      calories,
      protein,
      carbs,
      fats,
      serving_size_g: Number(servingSizeValue) || 0
    };

    setCustomEntriesByDate((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), activity]
    }));

    if (itemIndex !== null && visionScanResult?.items) {
      setVisionScanResult((prev) => ({
        ...prev,
        items: prev.items.filter((_, idx) => idx !== itemIndex)
      }));
    }

    alert(`Added "${foodName}" to dashboard!`);
    resetManualForm();
  };

  const handleSaveMacroEntry = () => {
    handleAddCustomFood({
      foodName: macroFallbackFoodName,
      servingSize: macroFallbackServingSize,
      protein: macroFallbackProtein,
      carbs: macroFallbackCarbs,
      fats: macroFallbackFats,
      mealType: macroFallbackMealType
    });
    setCurrentScreen('dashboard');
  };

  const handleRemoveActivity = (activityIndex, baseIndex) => {
    if (baseIndex !== undefined) {
      setRemovedBaseActivitiesByDate((prev) => {
        const removed = new Set(prev[selectedDate] || []);
        removed.add(baseIndex);
        return {
          ...prev,
          [selectedDate]: Array.from(removed)
        };
      });
      return;
    }

    const baseCount = todaysBaseActivities.length;
    const customIndex = activityIndex - baseCount;
    if (customIndex < 0) return;

    setCustomEntriesByDate((prev) => {
      const currentActivities = prev[selectedDate] ?? [];
      const updatedActivities = currentActivities.filter((_, index) => index !== customIndex);

      if (updatedActivities.length === 0) {
        const { [selectedDate]: removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [selectedDate]: updatedActivities
      };
    });
  };

  // Codes that style the clicked button
  const getButtonStyle = (screenId) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: currentScreen === screenId ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: currentScreen === screenId ? '#d33434' : '#3a18e6', fontWeight: currentScreen === screenId ? '600' : '300'
  });

  const goToPreviousDate = () => setSelectedDate((date) => changeDays(date, -1));
  const goToNextDate = () => setSelectedDate((date) => changeDays(date, 1));

  const handleDashboardTouchEnd = (event) => {
    if (!touchStartX) return;

    {/* changedTouches[0]: the "0" indicates the first finger */}
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
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#f4eeee', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '448px', height: '100vh', maxHeight: '850px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', border: '4px solid #1e293b', boxShadow: '0 25px 50px -12px rgb(240, 233, 233)' }}>
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', paddingBottom: '100px', position: 'relative' }}>
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              selectedDate={selectedDate}
              formatDateLabel={formatDateLabel}
              goToPreviousDate={goToPreviousDate}
              goToNextDate={goToNextDate}
              onSetTouchStart={setTouchStartX}
              onTouchEnd={handleDashboardTouchEnd}
              nutrition={nutrition}
              onRemoveActivity={handleRemoveActivity}
              onOpenDetails={() => setCurrentScreen('details')}
            />
          )}

          {currentScreen === 'details' && (
            <DetailsScreen
              weeklySummary={weeklySummary}
              historicalWeights={historicalWeights}
              onClose={() => setCurrentScreen('dashboard')}
            />
          )}

          {currentScreen === 'camera' && (
            <CameraScreen
              onClose={() => setCurrentScreen('manual entry')}
              onCapture={handlePhotoCaptured}
            />
          )}

          {currentScreen === 'manual entry' && (
            <ManualEntryScreen
              foodSearch={foodSearch}
              onFoodSearchChange={handleFoodSearchChange}
              filteredSuggestions={filteredSuggestions}
              onSelectSuggestion={handleSelectSuggestion}
              customFoodName={customFoodName}
              onCustomFoodNameChange={(event) => setCustomFoodName(event.target.value)}
              customServingSize={customServingSize}
              onCustomServingSizeChange={(event) => setCustomServingSize(event.target.value)}
              customMealType={customMealType}
              onCustomMealTypeChange={(event) => setCustomMealType(event.target.value)}
              scaledProtein={scaledProtein}
              scaledCarbs={scaledCarbs}
              scaledFats={scaledFats}
              previewCalories={previewCalories}
              onAddCustomFood={() => {
                handleAddCustomFood();
                setCurrentScreen('dashboard');
              }}
              showMacroFallbackModal={showMacroFallbackModal}
              openMacroFallbackModal={openMacroFallbackModal}
              onCloseMacroModal={() => setShowMacroFallbackModal(false)}
              macroFallbackFoodName={macroFallbackFoodName}
              onMacroFallbackFoodNameChange={(event) => setMacroFallbackFoodName(event.target.value)}
              macroFallbackServingSize={macroFallbackServingSize}
              onMacroFallbackServingSizeChange={(event) => setMacroFallbackServingSize(event.target.value)}
              macroFallbackProtein={macroFallbackProtein}
              onMacroFallbackProteinChange={(event) => setMacroFallbackProtein(event.target.value)}
              macroFallbackCarbs={macroFallbackCarbs}
              onMacroFallbackCarbsChange={(event) => setMacroFallbackCarbs(event.target.value)}
              macroFallbackFats={macroFallbackFats}
              onMacroFallbackFatsChange={(event) => setMacroFallbackFats(event.target.value)}
              macroFallbackMealType={macroFallbackMealType}
              onMacroFallbackMealTypeChange={(event) => setMacroFallbackMealType(event.target.value)}
              onSaveMacroEntry={handleSaveMacroEntry}
              visionScanStatus={visionScanStatus}
              visionScanResult={visionScanResult}
              visionScanError={visionScanError}
            />
          )}

        </main>

        <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderTop: '2px solid rgba(51, 65, 85, 0.8)', backdropFilter: 'blur(16px)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 10px', zIndex: 10 }}>
          <button onClick={() => setCurrentScreen('dashboard')} style={getButtonStyle('dashboard')}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <span style={{ fontSize: '12px' }}>Dashboard</span>
          </button>

          <button onClick={() => setCurrentScreen('camera')} style={getButtonStyle('camera')}>
            <span style={{ fontSize: '16px' }}>📷</span>
            <span style={{ fontSize: '12px' }}>Scan Food</span>
          </button>

          {/* Remove this for now 
          <button onClick={() => setCurrentScreen('analyzer')} style={getButtonStyle('analyzer')}>
            <span style={{ fontSize: '16px' }}>🧪</span>
            <span style={{ fontSize: '12px' }}>Analyze</span>
          </button>
          */}

          <button onClick={() => setCurrentScreen('manual entry')} style={getButtonStyle('manual entry')}>
            <span style={{ fontSize: '16px' }}>📝</span>
            <span style={{ fontSize: '12px' }}>Manual Entry</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
