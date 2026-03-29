import { pgTable, uuid, text, timestamp, integer, index } from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Community Event Groups
// ---------------------------------------------------------------------------

export const communityEventGroups = pgTable(
  "community_event_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    communityId: uuid("community_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    color: text("color").default("#6366f1"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_event_groups_community").on(table.communityId),
  ],
);

// ---------------------------------------------------------------------------
// Community Events
// ---------------------------------------------------------------------------

export const communityEvents = pgTable(
  "community_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    communityId: uuid("community_id").notNull(),
    groupId: uuid("group_id").references(() => communityEventGroups.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    location: text("location"),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_events_community").on(table.communityId, table.startsAt),
    index("idx_events_group").on(table.groupId),
  ],
);

// ---------------------------------------------------------------------------
// Community Messages
// ---------------------------------------------------------------------------

export const communityMessages = pgTable(
  "community_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    communityId: uuid("community_id").notNull(),
    userId: uuid("user_id").notNull(),
    body: text("body").notNull(),
    replyTo: uuid("reply_to"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_messages_community").on(table.communityId, table.createdAt),
  ],
);
