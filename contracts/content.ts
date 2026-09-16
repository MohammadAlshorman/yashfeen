import { z } from "zod";

/**
 * Shared Yashfeen CMS contracts — used by the admin tRPC router (validation)
 * and the admin UI (form types). Mirrors the EN/AR-paired content model
 * from the original local data layer.
 */

export const contentTypes = [
  "article",
  "doctor",
  "pharmacy",
  "service",
  "event",
  "episode",
  "story",
] as const;
export const contentTypeEnum = z.enum(contentTypes);
export type ContentType = z.infer<typeof contentTypeEnum>;

export const publishStatusEnum = z.enum(["draft", "published"]);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "ISO date YYYY-MM-DD");
const localizedPair = { en: z.string().min(1), ar: z.string().min(1) };

export const articleInput = z.object({
  slug: z.string().min(1).max(191),
  titleEn: localizedPair.en, titleAr: localizedPair.ar,
  dekEn: z.string().min(1), dekAr: z.string().min(1),
  category: z.enum(["public-health", "nutrition", "mental-health", "research", "policy"]),
  categoryLabelEn: z.string().min(1), categoryLabelAr: z.string().min(1),
  bodyEn: z.array(z.string()).min(1), bodyAr: z.array(z.string()).min(1),
  sourceNameEn: z.string().min(1), sourceNameAr: z.string().min(1),
  sourceUrl: z.string().default("#"),
  publishedAt: isoDate,
  readMins: z.number().int().min(1).max(60),
});

export const doctorInput = z.object({
  nameEn: localizedPair.en, nameAr: localizedPair.ar,
  specialtyEn: z.string().min(1), specialtyAr: z.string().min(1),
  languages: z.array(z.string()).min(1),
  clinicEn: z.string().min(1), clinicAr: z.string().min(1),
  cityEn: z.string().min(1), cityAr: z.string().min(1),
  phone: z.string().min(1),
  verified: z.boolean(),
  bioEn: z.string().min(1), bioAr: z.string().min(1),
  slots: z.array(z.string()).min(1),
  sourceNameEn: z.string().min(1), sourceNameAr: z.string().min(1),
  sourceUrl: z.string().default("#"),
  updateEn: z.string().min(1), updateAr: z.string().min(1),
  updateSourceEn: z.string().min(1), updateSourceAr: z.string().min(1),
  updateDate: isoDate,
});

export const pharmacyInput = z.object({
  nameEn: localizedPair.en, nameAr: localizedPair.ar,
  areaEn: z.string().min(1), areaAr: z.string().min(1),
  cityEn: z.string().min(1), cityAr: z.string().min(1),
  hoursEn: z.string().min(1), hoursAr: z.string().min(1),
  onDuty: z.boolean(),
  phone: z.string().min(1),
  verified: z.boolean(),
  sourceNameEn: z.string().min(1), sourceNameAr: z.string().min(1),
  sourceUrl: z.string().default("#"),
  updateEn: z.string().min(1), updateAr: z.string().min(1),
  updateSourceEn: z.string().min(1), updateSourceAr: z.string().min(1),
  updateDate: isoDate,
});

export const serviceInput = z.object({
  nameEn: localizedPair.en, nameAr: localizedPair.ar,
  type: z.enum(["lab", "imaging", "physio", "home-care"]),
  cityEn: z.string().min(1), cityAr: z.string().min(1),
  priceFrom: z.number().int().min(0),
  providerEn: z.string().min(1), providerAr: z.string().min(1),
  sourceNameEn: z.string().min(1), sourceNameAr: z.string().min(1),
  sourceUrl: z.string().default("#"),
});

export const eventInput = z.object({
  titleEn: localizedPair.en, titleAr: localizedPair.ar,
  category: z.enum(["screening", "workshop", "walk", "talk"]),
  date: isoDate,
  timeEn: z.string().min(1), timeAr: z.string().min(1),
  cityEn: z.string().min(1), cityAr: z.string().min(1),
  venueEn: z.string().min(1), venueAr: z.string().min(1),
  hostEn: z.string().min(1), hostAr: z.string().min(1),
  free: z.boolean(),
  price: z.number().int().min(0).nullable().optional(),
  sourceNameEn: z.string().min(1), sourceNameAr: z.string().min(1),
  sourceUrl: z.string().default("#"),
});

export const episodeInput = z.object({
  number: z.number().int().min(1),
  titleEn: localizedPair.en, titleAr: localizedPair.ar,
  guestsEn: z.array(z.string()).min(1), guestsAr: z.array(z.string()).min(1),
  airedAt: isoDate,
  durationMins: z.number().int().min(1),
  topicsEn: z.array(z.string()).min(1), topicsAr: z.array(z.string()).min(1),
  summaryEn: z.string().min(1), summaryAr: z.string().min(1),
  notesEn: z.string().min(1), notesAr: z.string().min(1),
});

export const storyInput = z.object({
  authorEn: localizedPair.en, authorAr: localizedPair.ar,
  cityEn: z.string().min(1), cityAr: z.string().min(1),
  titleEn: z.string().min(1), titleAr: z.string().min(1),
  quoteEn: z.string().min(1), quoteAr: z.string().min(1),
  excerptEn: z.string().min(1), excerptAr: z.string().min(1),
  bodyEn: z.array(z.string()).min(1), bodyAr: z.array(z.string()).min(1),
  destination: z.enum(["dead-sea", "main-hot-springs", "wadi-rum", "petra", "aqaba"]).nullable().optional(),
  destinationLabelEn: z.string().nullable().optional(),
  destinationLabelAr: z.string().nullable().optional(),
  moodTag: z.enum(["calm", "energized", "stressed", "tired", "joyful"]),
});

export const inputSchemas = {
  article: articleInput,
  doctor: doctorInput,
  pharmacy: pharmacyInput,
  service: serviceInput,
  event: eventInput,
  episode: episodeInput,
  story: storyInput,
} as const;

export const createContentInput = z.discriminatedUnion("type", [
  z.object({ type: z.literal("article"), data: articleInput }),
  z.object({ type: z.literal("doctor"), data: doctorInput }),
  z.object({ type: z.literal("pharmacy"), data: pharmacyInput }),
  z.object({ type: z.literal("service"), data: serviceInput }),
  z.object({ type: z.literal("event"), data: eventInput }),
  z.object({ type: z.literal("episode"), data: episodeInput }),
  z.object({ type: z.literal("story"), data: storyInput }),
]);

export const updateContentInput = z.discriminatedUnion("type", [
  z.object({ type: z.literal("article"), id: z.number().int().positive(), data: articleInput.partial() }),
  z.object({ type: z.literal("doctor"), id: z.number().int().positive(), data: doctorInput.partial() }),
  z.object({ type: z.literal("pharmacy"), id: z.number().int().positive(), data: pharmacyInput.partial() }),
  z.object({ type: z.literal("service"), id: z.number().int().positive(), data: serviceInput.partial() }),
  z.object({ type: z.literal("event"), id: z.number().int().positive(), data: eventInput.partial() }),
  z.object({ type: z.literal("episode"), id: z.number().int().positive(), data: episodeInput.partial() }),
  z.object({ type: z.literal("story"), id: z.number().int().positive(), data: storyInput.partial() }),
]);

export const setStatusInput = z.object({
  type: contentTypeEnum,
  id: z.number().int().positive(),
  status: publishStatusEnum,
});

export const removeContentInput = z.object({
  type: contentTypeEnum,
  id: z.number().int().positive(),
});

export const listContentInput = z.object({
  type: contentTypeEnum,
  status: publishStatusEnum.optional(),
});
