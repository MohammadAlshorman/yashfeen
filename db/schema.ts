import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ------------------------------------------------------------------ */
/* Yashfeen CMS content tables                                             */
/*                                                                     */
/* Conventions (kept compatible with the original src/data TS types):  */
/* - Localized strings  -> `<field>En` / `<field>Ar` column pairs      */
/* - String arrays      -> MySQL JSON columns (string[])               */
/* - Dates              -> ISO `YYYY-MM-DD` varchar(10) strings        */
/* - Every table has `status` (draft|published) — the public API only  */
/*   ever returns `published` rows. `sample` flags the seed dataset.   */
/* ------------------------------------------------------------------ */

const status = mysqlEnum("status", ["draft", "published"])
  .default("draft")
  .notNull();
const sample = boolean("sample").default(false).notNull();
const createdAt = timestamp("createdAt").defaultNow().notNull();
const updatedAt = timestamp("updatedAt")
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date());

export const articleCategories = [
  "public-health",
  "nutrition",
  "mental-health",
  "research",
  "policy",
] as const;
export const serviceTypes = ["lab", "imaging", "physio", "home-care"] as const;
export const eventCategories = ["screening", "workshop", "walk", "talk"] as const;
export const moodTags = ["calm", "energized", "stressed", "tired", "joyful"] as const;
export const destinations = [
  "dead-sea",
  "main-hot-springs",
  "wadi-rum",
  "petra",
  "aqaba",
] as const;

export const articles = mysqlTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  dekEn: text("dekEn").notNull(),
  dekAr: text("dekAr").notNull(),
  category: mysqlEnum("category", articleCategories).notNull(),
  categoryLabelEn: varchar("categoryLabelEn", { length: 100 }).notNull(),
  categoryLabelAr: varchar("categoryLabelAr", { length: 100 }).notNull(),
  bodyEn: json("bodyEn").$type<string[]>().notNull(),
  bodyAr: json("bodyAr").$type<string[]>().notNull(),
  sourceNameEn: varchar("sourceNameEn", { length: 255 }).notNull(),
  sourceNameAr: varchar("sourceNameAr", { length: 255 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 512 }).notNull().default("#"),
  publishedAt: varchar("publishedAt", { length: 10 }).notNull(),
  readMins: int("readMins").notNull().default(3),
  status,
  sample,
  createdAt,
  updatedAt,
});

export const doctors = mysqlTable("doctors", {
  id: serial("id").primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  specialtyEn: varchar("specialtyEn", { length: 255 }).notNull(),
  specialtyAr: varchar("specialtyAr", { length: 255 }).notNull(),
  languages: json("languages").$type<string[]>().notNull(),
  clinicEn: varchar("clinicEn", { length: 255 }).notNull(),
  clinicAr: varchar("clinicAr", { length: 255 }).notNull(),
  cityEn: varchar("cityEn", { length: 100 }).notNull(),
  cityAr: varchar("cityAr", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  verified: boolean("verified").default(false).notNull(),
  bioEn: text("bioEn").notNull(),
  bioAr: text("bioAr").notNull(),
  slots: json("slots").$type<string[]>().notNull(),
  sourceNameEn: varchar("sourceNameEn", { length: 255 }).notNull(),
  sourceNameAr: varchar("sourceNameAr", { length: 255 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 512 }).notNull().default("#"),
  updateEn: text("updateEn").notNull(),
  updateAr: text("updateAr").notNull(),
  updateSourceEn: varchar("updateSourceEn", { length: 255 }).notNull(),
  updateSourceAr: varchar("updateSourceAr", { length: 255 }).notNull(),
  updateDate: varchar("updateDate", { length: 10 }).notNull(),
  status,
  sample,
  createdAt,
  updatedAt,
});

export const pharmacies = mysqlTable("pharmacies", {
  id: serial("id").primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  areaEn: varchar("areaEn", { length: 255 }).notNull(),
  areaAr: varchar("areaAr", { length: 255 }).notNull(),
  cityEn: varchar("cityEn", { length: 100 }).notNull(),
  cityAr: varchar("cityAr", { length: 100 }).notNull(),
  hoursEn: varchar("hoursEn", { length: 255 }).notNull(),
  hoursAr: varchar("hoursAr", { length: 255 }).notNull(),
  onDuty: boolean("onDuty").default(false).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  verified: boolean("verified").default(false).notNull(),
  sourceNameEn: varchar("sourceNameEn", { length: 255 }).notNull(),
  sourceNameAr: varchar("sourceNameAr", { length: 255 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 512 }).notNull().default("#"),
  updateEn: text("updateEn").notNull(),
  updateAr: text("updateAr").notNull(),
  updateSourceEn: varchar("updateSourceEn", { length: 255 }).notNull(),
  updateSourceAr: varchar("updateSourceAr", { length: 255 }).notNull(),
  updateDate: varchar("updateDate", { length: 10 }).notNull(),
  status,
  sample,
  createdAt,
  updatedAt,
});

export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  type: mysqlEnum("type", serviceTypes).notNull(),
  cityEn: varchar("cityEn", { length: 100 }).notNull(),
  cityAr: varchar("cityAr", { length: 100 }).notNull(),
  priceFrom: int("priceFrom").notNull(),
  providerEn: varchar("providerEn", { length: 255 }).notNull(),
  providerAr: varchar("providerAr", { length: 255 }).notNull(),
  sourceNameEn: varchar("sourceNameEn", { length: 255 }).notNull(),
  sourceNameAr: varchar("sourceNameAr", { length: 255 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 512 }).notNull().default("#"),
  status,
  sample,
  createdAt,
  updatedAt,
});

export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  category: mysqlEnum("category", eventCategories).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  timeEn: varchar("timeEn", { length: 100 }).notNull(),
  timeAr: varchar("timeAr", { length: 100 }).notNull(),
  cityEn: varchar("cityEn", { length: 100 }).notNull(),
  cityAr: varchar("cityAr", { length: 100 }).notNull(),
  venueEn: varchar("venueEn", { length: 255 }).notNull(),
  venueAr: varchar("venueAr", { length: 255 }).notNull(),
  hostEn: varchar("hostEn", { length: 255 }).notNull(),
  hostAr: varchar("hostAr", { length: 255 }).notNull(),
  free: boolean("free").default(true).notNull(),
  price: int("price"),
  sourceNameEn: varchar("sourceNameEn", { length: 255 }).notNull(),
  sourceNameAr: varchar("sourceNameAr", { length: 255 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 512 }).notNull().default("#"),
  status,
  sample,
  createdAt,
  updatedAt,
});

export const episodes = mysqlTable("episodes", {
  id: serial("id").primaryKey(),
  number: int("number").notNull().unique(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  guestsEn: json("guestsEn").$type<string[]>().notNull(),
  guestsAr: json("guestsAr").$type<string[]>().notNull(),
  airedAt: varchar("airedAt", { length: 10 }).notNull(),
  durationMins: int("durationMins").notNull(),
  topicsEn: json("topicsEn").$type<string[]>().notNull(),
  topicsAr: json("topicsAr").$type<string[]>().notNull(),
  summaryEn: text("summaryEn").notNull(),
  summaryAr: text("summaryAr").notNull(),
  notesEn: text("notesEn").notNull(),
  notesAr: text("notesAr").notNull(),
  status,
  sample,
  createdAt,
  updatedAt,
});

export const stories = mysqlTable("stories", {
  id: serial("id").primaryKey(),
  authorEn: varchar("authorEn", { length: 255 }).notNull(),
  authorAr: varchar("authorAr", { length: 255 }).notNull(),
  cityEn: varchar("cityEn", { length: 100 }).notNull(),
  cityAr: varchar("cityAr", { length: 100 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  quoteEn: text("quoteEn").notNull(),
  quoteAr: text("quoteAr").notNull(),
  excerptEn: text("excerptEn").notNull(),
  excerptAr: text("excerptAr").notNull(),
  bodyEn: json("bodyEn").$type<string[]>().notNull(),
  bodyAr: json("bodyAr").$type<string[]>().notNull(),
  destination: mysqlEnum("destination", destinations),
  destinationLabelEn: varchar("destinationLabelEn", { length: 255 }),
  destinationLabelAr: varchar("destinationLabelAr", { length: 255 }),
  moodTag: mysqlEnum("moodTag", moodTags).notNull(),
  status,
  sample,
  createdAt,
  updatedAt,
});

export type Article = typeof articles.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type Pharmacy = typeof pharmacies.$inferSelect;
export type Service = typeof services.$inferSelect;
export type CmsEvent = typeof events.$inferSelect;
export type Episode = typeof episodes.$inferSelect;
export type Story = typeof stories.$inferSelect;
