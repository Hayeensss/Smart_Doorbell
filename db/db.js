const { db } = require("@/db");
const { events: eventsTable, devices: devicesTable } = require("./schema");
const { eq, desc, and, or, gte, lte, sql } = require("drizzle-orm");
const { subDays, endOfDay, startOfDay } = require("date-fns");


async function getRecentEventsWithDeviceNames(limit = 10, filters = {}) {
  try {
    const { 
      date = new Date(), 
      timeRange = '24h', 
      eventTypes = { motion: true, ring: true, person: true } 
    } = filters;

    let dateFilterConditions;
    const targetDate = new Date(date);

    switch (timeRange) {
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

    const activeEventTypes = Object.entries(eventTypes)
      .filter(([, isActive]) => isActive)
      .map(([type]) => type);

    let eventTypeFilterConditions = null;
    if (activeEventTypes.length > 0 && activeEventTypes.length < Object.keys(eventTypes).length) {
      eventTypeFilterConditions = or(...activeEventTypes.map(type => eq(eventsTable.eventType, type)));
    }

    const queryConditions = [];
    if (dateFilterConditions) queryConditions.push(dateFilterConditions);
    if (eventTypeFilterConditions) queryConditions.push(eventTypeFilterConditions);
    
    const finalCondition = queryConditions.length > 0 ? and(...queryConditions) : undefined;

    const rawDbData = await db
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
      .limit(limit);

    const formattedEvents = rawDbData.map((item) => ({
      id: item.eventId,
      deviceId: item.deviceId,
      deviceName: item.deviceName || "Unknown Device",
      eventType: item.eventType,
      timestamp: new Date(item.occurredAt),
      hasRecording: false,
      thumbnail: null,
    }));
    return formattedEvents;
  } catch (error) {
    console.error("Error in getRecentEventsWithDeviceNames:", error);
    throw new Error(`Database query failed: ${error.message}`); 
  }
}

async function upsertUserPreferences(userId, preferences) {
  const { notificationsEnabled, soundsEnabled, defaultMode } = preferences;
  const { userPreferences: userPreferencesTable } = require("./schema"); // Ensure this path is correct

  try {
    const result = await db.insert(userPreferencesTable)
      .values({
        userId,
        notificationsEnabled,
        soundsEnabled,
        defaultMode,
        // Assuming 'updatedAt' is handled by DB default or onUpdateNow in schema
      })
      .onConflictDoUpdate({ // Specific to PostgreSQL adapter in Drizzle
        target: userPreferencesTable.userId, // Assumes userId is the PK or has a unique constraint
        set: {
          notificationsEnabled,
          soundsEnabled,
          defaultMode,
          updatedAt: sql`NOW()`, // Explicitly set updatedAt for the update case
        }
      })
      .returning(); // Return all columns of the inserted/updated row

    if (!result || result.length === 0) {
      throw new Error("Database did not return the saved preferences.");
    }
    return result[0];
  } catch (error) {
    console.error("Error in upsertUserPreferences:", error);
    throw new Error(`Database upsert failed: ${error.message}`);
  }
}

/**
 * Fetches user preferences from the database.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object|null>} The preference object or null if not found.
 */
async function getUserPreferences(userId) {
  const { userPreferences: userPreferencesTable } = require("./schema"); // Ensure this path is correct
  try {
    const result = await db.select()
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.userId, userId))
      .limit(1);
    return result[0] || null; // Return the preference object or null if not found
  } catch (error) {
    console.error("Error in getUserPreferences:", error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

module.exports = {
  getRecentEventsWithDeviceNames,
  upsertUserPreferences,   // Export new function
  getUserPreferences,     // Export new function
};
