const { db } = require("@/db");
const { events: eventsTable, devices: devicesTable, userPreferences: userPreferencesTable, media: mediaTable } = require("./schema");
const { eq, desc, and, or, gte, lte, sql, inArray } = require("drizzle-orm");
const { subDays, endOfDay, startOfDay } = require("date-fns");

function buildEventWhereClause(filters = {}) {
  let dateFilterConditions;
  if (filters.date && filters.timeRange) {
    const targetDate = new Date(filters.date);
    switch (filters.timeRange) {
      case '7d':
        dateFilterConditions = gte(eventsTable.occurredAt, subDays(startOfDay(targetDate), 6));
        break;
      case '30d':
        dateFilterConditions = gte(eventsTable.occurredAt, subDays(startOfDay(targetDate), 29));
        break;
      case '24h':
      default:
        dateFilterConditions = and(
          gte(eventsTable.occurredAt, startOfDay(targetDate)),
          lte(eventsTable.occurredAt, endOfDay(targetDate))
        );
        break;
    }
  }

  let eventTypeFilterConditions = null;
  if (filters.eventTypes && Object.keys(filters.eventTypes).length > 0) {
    const activeEventTypes = Object.entries(filters.eventTypes)
      .filter(([, isActive]) => isActive)
      .map(([type]) => type);
    if (activeEventTypes.length > 0) {
      eventTypeFilterConditions = or(...activeEventTypes.map(type => eq(eventsTable.eventType, type)));
    }
  }

  const queryConditions = [];
  if (dateFilterConditions) queryConditions.push(dateFilterConditions);
  if (eventTypeFilterConditions) queryConditions.push(eventTypeFilterConditions);
  
  return queryConditions.length > 0 ? and(...queryConditions) : undefined;
}

async function getRecentEventsWithDeviceNames(limit = 10, offset = 0, filters = {}) {
  try {
    const finalCondition = buildEventWhereClause(filters);

    // First, get all events
    const rawEvents = await db
      .select({
        eventId: eventsTable.eventId,
        deviceId: eventsTable.deviceId,
        eventType: eventsTable.eventType,
        occurredAt: eventsTable.occurredAt,
        deviceName: devicesTable.name,
      })
      .from(eventsTable)
      .leftJoin(devicesTable, eq(eventsTable.deviceId, devicesTable.deviceId))
      .where(finalCondition)
      .orderBy(desc(eventsTable.occurredAt))
      .limit(limit)
      .offset(offset);
      
    // Get all media for these events in a separate query
    const eventIds = rawEvents.map(event => event.eventId);
    
    const mediaItems = eventIds.length > 0 
      ? await db
          .select({
            eventRef: mediaTable.eventRef,
            mediaId: mediaTable.mediaId,
            mediaType: mediaTable.mediaType,
            url: mediaTable.url,
          })
          .from(mediaTable)
          .where(inArray(mediaTable.eventRef, eventIds))
      : [];
    
    // Group media by event ID
    const mediaByEvent = {};
    mediaItems.forEach(item => {
      if (!mediaByEvent[item.eventRef]) {
        mediaByEvent[item.eventRef] = {
          images: [],
          videos: [],
        };
      }
      
      if (item.mediaType === 'image') {
        mediaByEvent[item.eventRef].images.push({
          id: item.mediaId,
          url: item.url,
        });
      } else if (item.mediaType === 'video') {
        mediaByEvent[item.eventRef].videos.push({
          id: item.mediaId,
          url: item.url,
        });
      }
    });
    
    // Format events with their media
    const formattedEvents = rawEvents.map(event => {
      const eventMedia = mediaByEvent[event.eventId] || { images: [], videos: [] };
      const hasImages = eventMedia.images.length > 0;
      const hasVideos = eventMedia.videos.length > 0;
      
      // Choose thumbnail: prefer image over video
      let thumbnail = null;
      if (hasImages) {
        thumbnail = eventMedia.images[0].url;
      } else if (hasVideos) {
        thumbnail = eventMedia.videos[0].url;
      }
      
      return {
        id: event.eventId,
        deviceId: event.deviceId,
        deviceName: event.deviceName || "Unknown Device",
        eventType: event.eventType,
        timestamp: new Date(event.occurredAt),
        hasRecording: hasVideos,
        thumbnail,
        media: {
          images: eventMedia.images,
          videos: eventMedia.videos,
        }
      };
    });
    
    return formattedEvents;
  } catch (error) { 
    console.error("Error in getRecentEventsWithDeviceNames:", error);
    throw new Error(`Database query failed: ${error.message}`); 
  }
}

async function getEventsCount(filters = {}) {
  try {
    const finalCondition = buildEventWhereClause(filters);

    const result = await db
      .select({ count: sql`count(*)::int` })
      .from(eventsTable)
      .where(finalCondition);
      
    return result[0]?.count ?? 0;
  } catch (error) {
    console.error("Error in getEventsCount:", error);
    throw new Error(`Database count query failed: ${error.message}`);
  }
}

async function getDistinctEventTypes() {
  try {
    const result = await db
      .selectDistinct({ eventType: eventsTable.eventType })
      .from(eventsTable)
      .orderBy(eventsTable.eventType);
      
    return result.map(item => item.eventType);
  } catch (error) {
    console.error("Error in getDistinctEventTypes:", error);
    throw new Error(`Database distinct query failed: ${error.message}`);
  }
}

async function upsertUserPreferences(userId, preferences) {
  const { notificationsEnabled, soundsEnabled } = preferences;

  try {
    const result = await db.insert(userPreferencesTable)
      .values({
        userId,
        notificationsEnabled,
        soundsEnabled,
      })
      .onConflictDoUpdate({
        target: userPreferencesTable.userId,
        set: {
          notificationsEnabled,
          soundsEnabled,
          updatedAt: sql`NOW()`,
        }
      })
      .returning();

    if (!result || result.length === 0) {
      throw new Error("Database did not return the saved preferences.");
    }
    return result[0];
  } catch (error) {
    console.error("Error in upsertUserPreferences:", error);
    throw new Error(`Database upsert failed: ${error.message}`);
  }
}

async function getUserPreferences(userId) {
  try {
    const result = await db.select() 
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.userId, userId))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Error in getUserPreferences:", error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

module.exports = {
  getRecentEventsWithDeviceNames,
  getEventsCount,
  getDistinctEventTypes,
  upsertUserPreferences,
  getUserPreferences,
};
