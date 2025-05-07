import { NextResponse } from 'next/server';
import { getRecentEventsWithDeviceNames } from '@/db/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get('limit')) || 10;
  const date = searchParams.get('date') ? new Date(searchParams.get('date')) : new Date();
  const timeRange = searchParams.get('timeRange') || '24h';
  
  let eventTypes = {
    motion: true,
    ring: true,
    person: true,
  };
  try {
    const eventTypesQuery = searchParams.get('eventTypes');
    if (eventTypesQuery) {
      eventTypes = JSON.parse(eventTypesQuery);
    }
  } catch (e) {
    console.error('Could not parse eventTypes query parameter:', e.message);
  }

  const filters = {
    date,
    timeRange,
    eventTypes,
  };

  try {
    const events = await getRecentEventsWithDeviceNames(limit, filters);
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 