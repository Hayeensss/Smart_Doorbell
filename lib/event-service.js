const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function getInitialEvents(filters) {
  const queryParams = new URLSearchParams({
    limit: filters.limit || 10,
    date: filters.date instanceof Date ? filters.date.toISOString() : new Date(filters.date).toISOString(),
    timeRange: filters.timeRange,
    eventTypes: JSON.stringify(filters.eventTypes),
  });

  try {
    const response = await fetch(`${API_BASE_URL}/api/events?${queryParams.toString()}`, {
      cache: 'no-store', // Ensures fresh data for server-side rendering, adjust as needed
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      console.error("Error fetching initial events in service:", errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const fetchedEvents = await response.json();
    return fetchedEvents;
  } catch (err) {
    console.error("Error in getInitialEvents service:", err);
    // Re-throw the error so the calling Server Component can handle it
    throw err;
  }
} 