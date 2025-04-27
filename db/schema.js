const {
  pgTable,
  uuid,
  text,
  timestamp,
  bigint,
  jsonb,
  integer,
  boolean,
  serial,
} = require("drizzle-orm/pg-core");
const { relations } = require("drizzle-orm");

// 1. devices: represents each smart doorbell
const devices = pgTable("devices", {
  deviceId: uuid("device_id").primaryKey().defaultRandom(),
  ownerId: text("owner_id").notNull(), // Clerk user ID
  name: text("name").notNull(),
  location: text("location"),
  pairedAt: timestamp("paired_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

const devicesRelations = relations(devices, ({ many }) => ({
  events: many(events),
}));

// 2. events: all device-side events
const events = pgTable("events", {
  eventId: serial("event_id").primaryKey(),
  deviceId: uuid("device_id")
    .notNull()
    .references(() => devices.deviceId),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull().default({}),
  occurredAt: timestamp("occurred_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

const eventsRelations = relations(events, ({ one, many }) => ({
  device: one(devices, {
    fields: [events.deviceId],
    references: [devices.deviceId],
  }),
  media: many(media),
}));

// 3. media: linked recordings and messages
const media = pgTable("media", {
  mediaId: serial("media_id").primaryKey(),
  eventRef: bigint("event_ref", { mode: "number" }).references(
    () => events.eventId
  ),
  mediaType: text("media_type").notNull(),
  url: text("url").notNull(),
  durationS: integer("duration_s"),
  transcript: text("transcript"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

const mediaRelations = relations(media, ({ one }) => ({
  event: one(events, {
    fields: [media.eventRef],
    references: [events.eventId],
  }),
}));

// 4. user_preferences: stores default user settings
const userPreferences = pgTable("user_preferences", {
  userId: text("user_id").primaryKey(),
  defaultMode: text("default_mode").notNull().default("Home"),
  defaultClipDuration: integer("default_clip_duration").notNull().default(0),
  notificationsEnabled: boolean("notifications_enabled")
    .notNull()
    .default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Export all tables and relations
module.exports = {
  devices,
  devicesRelations,
  events,
  eventsRelations,
  media,
  mediaRelations,
  userPreferences,
};
