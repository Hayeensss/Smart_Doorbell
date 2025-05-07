export const defaultInitialFilters = {
    date: new Date().toISOString(),
    timeRange: "24h",
  };
  
export function parseFiltersFromParams(searchParams, availableEventTypes = []) {
    let parsedFilters = {};
    let useDefaultsForDB = true;
  
    if (searchParams.date && searchParams.timeRange) {
      parsedFilters.date = searchParams.date;
      parsedFilters.timeRange = searchParams.timeRange;
      useDefaultsForDB = false;
    } else {
      parsedFilters.date = defaultInitialFilters.date;
      parsedFilters.timeRange = defaultInitialFilters.timeRange;
    }
  
    let eventTypesForUI = {};
    if (searchParams.eventTypes) {
      try {
        const typesFromUrl = JSON.parse(searchParams.eventTypes);
        availableEventTypes.forEach(type => {
          eventTypesForUI[type] = typesFromUrl[type] === true;
        });
        useDefaultsForDB = false;
      } catch (e) {
        console.error("Error parsing eventTypes from URL, using defaults:", e);
        availableEventTypes.forEach(type => { eventTypesForUI[type] = true; });
      }
    } else {
      availableEventTypes.forEach(type => { eventTypesForUI[type] = true; });
    }
    parsedFilters.eventTypes = eventTypesForUI;
    
    const dbQueryFilters = useDefaultsForDB ? {} : { 
      date: new Date(parsedFilters.date), 
      timeRange: parsedFilters.timeRange,
      eventTypes: parsedFilters.eventTypes
    };
    
    const uiInitializationFilters = { 
      date: parsedFilters.date, 
      timeRange: parsedFilters.timeRange,
      eventTypes: parsedFilters.eventTypes
    };
  
    return { dbQueryFilters, uiInitializationFilters, availableEventTypes };
  } 