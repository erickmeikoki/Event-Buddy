import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase UID
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  location: text("location"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  venue: text("venue").notNull(),
  location: text("location").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  priceRange: text("price_range"),
  featured: boolean("featured").default(false),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertInterestSchema = createInsertSchema(interests).omit({
  id: true,
});

export const userInterests = pgTable("user_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  interestId: integer("interest_id").notNull(),
});

export const insertUserInterestSchema = createInsertSchema(userInterests).omit({
  id: true,
});

export const buddyRequests = pgTable("buddy_requests", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  eventId: integer("event_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBuddyRequestSchema = createInsertSchema(buddyRequests).omit({
  id: true,
  createdAt: true,
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types for the schemas
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;

export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = z.infer<typeof insertUserInterestSchema>;

export type BuddyRequest = typeof buddyRequests.$inferSelect;
export type InsertBuddyRequest = z.infer<typeof insertBuddyRequestSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
