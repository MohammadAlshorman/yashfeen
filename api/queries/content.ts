import { eq } from "drizzle-orm";
import { getDb } from "./connection";
import * as schema from "@db/schema";
import type { ContentType } from "@contracts/content";

/**
 * Yashfeen CMS query layer.
 *
 * `toPublic*` mappers reconstruct the EXACT shapes the frontend's local
 * data layer used (Localized {en,ar} pairs, Localized[] paragraph arrays)
 * so public pages can switch from static imports to tRPC with minimal
 * change. Public reads are ALWAYS published-only.
 */

const loc = (en: string, ar: string) => ({ en, ar });
const locList = (en: string[], ar: string[]) =>
  en.map((e, i) => ({ en: e, ar: ar[i] ?? e }));

/* ---------- Public mappers (published content → frontend shapes) ---------- */

export function toPublicArticle(r: schema.Article) {
  return {
    id: String(r.id),
    slug: r.slug,
    title: loc(r.titleEn, r.titleAr),
    dek: loc(r.dekEn, r.dekAr),
    category: r.category,
    categoryLabel: loc(r.categoryLabelEn, r.categoryLabelAr),
    body: locList(r.bodyEn, r.bodyAr),
    source: { name: loc(r.sourceNameEn, r.sourceNameAr), url: r.sourceUrl },
    publishedAt: r.publishedAt,
    readMins: r.readMins,
    disclaimer: true as const,
    _sample: r.sample,
  };
}

export function toPublicDoctor(r: schema.Doctor) {
  return {
    id: String(r.id),
    name: loc(r.nameEn, r.nameAr),
    specialty: loc(r.specialtyEn, r.specialtyAr),
    languages: r.languages,
    clinic: loc(r.clinicEn, r.clinicAr),
    city: loc(r.cityEn, r.cityAr),
    phone: r.phone,
    verified: r.verified,
    bio: loc(r.bioEn, r.bioAr),
    slots: r.slots,
    source: { name: loc(r.sourceNameEn, r.sourceNameAr), url: r.sourceUrl },
    update: loc(r.updateEn, r.updateAr),
    updateSource: loc(r.updateSourceEn, r.updateSourceAr),
    updateDate: r.updateDate,
    _sample: r.sample,
  };
}

export function toPublicPharmacy(r: schema.Pharmacy) {
  return {
    id: String(r.id),
    name: loc(r.nameEn, r.nameAr),
    area: loc(r.areaEn, r.areaAr),
    city: loc(r.cityEn, r.cityAr),
    hours: loc(r.hoursEn, r.hoursAr),
    onDuty: r.onDuty,
    phone: r.phone,
    verified: r.verified,
    source: { name: loc(r.sourceNameEn, r.sourceNameAr), url: r.sourceUrl },
    update: loc(r.updateEn, r.updateAr),
    updateSource: loc(r.updateSourceEn, r.updateSourceAr),
    updateDate: r.updateDate,
    _sample: r.sample,
  };
}

export function toPublicService(r: schema.Service) {
  return {
    id: String(r.id),
    name: loc(r.nameEn, r.nameAr),
    type: r.type,
    city: loc(r.cityEn, r.cityAr),
    priceFrom: r.priceFrom,
    provider: loc(r.providerEn, r.providerAr),
    source: { name: loc(r.sourceNameEn, r.sourceNameAr), url: r.sourceUrl },
    _sample: r.sample,
  };
}

export function toPublicEvent(r: schema.CmsEvent) {
  return {
    id: String(r.id),
    title: loc(r.titleEn, r.titleAr),
    category: r.category,
    date: r.date,
    time: loc(r.timeEn, r.timeAr),
    city: loc(r.cityEn, r.cityAr),
    venue: loc(r.venueEn, r.venueAr),
    host: loc(r.hostEn, r.hostAr),
    free: r.free,
    price: r.price ?? undefined,
    source: { name: loc(r.sourceNameEn, r.sourceNameAr), url: r.sourceUrl },
    _sample: r.sample,
  };
}

export function toPublicEpisode(r: schema.Episode) {
  return {
    id: String(r.id),
    number: r.number,
    title: loc(r.titleEn, r.titleAr),
    guests: locList(r.guestsEn, r.guestsAr),
    airedAt: r.airedAt,
    durationMins: r.durationMins,
    topics: locList(r.topicsEn, r.topicsAr),
    summary: loc(r.summaryEn, r.summaryAr),
    notes: loc(r.notesEn, r.notesAr),
    _sample: r.sample,
  };
}

export function toPublicStory(r: schema.Story) {
  return {
    id: String(r.id),
    author: loc(r.authorEn, r.authorAr),
    city: loc(r.cityEn, r.cityAr),
    title: loc(r.titleEn, r.titleAr),
    quote: loc(r.quoteEn, r.quoteAr),
    excerpt: loc(r.excerptEn, r.excerptAr),
    body: locList(r.bodyEn, r.bodyAr),
    destination: (r.destination ?? undefined) as
      | "dead-sea" | "main-hot-springs" | "wadi-rum" | "petra" | "aqaba" | undefined,
    destinationLabel:
      r.destinationLabelEn && r.destinationLabelAr
        ? loc(r.destinationLabelEn, r.destinationLabelAr)
        : undefined,
    moodTag: r.moodTag,
    _sample: r.sample,
  };
}

/* ---------- Public reads (published only) ---------- */

const published = eq(schema.articles.status, "published");

export async function listPublishedArticles() {
  const rows = await getDb().select().from(schema.articles).where(published);
  return rows.map(toPublicArticle);
}
export async function listPublishedDoctors() {
  const rows = await getDb().select().from(schema.doctors).where(eq(schema.doctors.status, "published"));
  return rows.map(toPublicDoctor);
}
export async function listPublishedPharmacies() {
  const rows = await getDb().select().from(schema.pharmacies).where(eq(schema.pharmacies.status, "published"));
  return rows.map(toPublicPharmacy);
}
export async function listPublishedServices() {
  const rows = await getDb().select().from(schema.services).where(eq(schema.services.status, "published"));
  return rows.map(toPublicService);
}
export async function listPublishedEvents() {
  const rows = await getDb().select().from(schema.events).where(eq(schema.events.status, "published"));
  return rows.map(toPublicEvent);
}
export async function listPublishedEpisodes() {
  const rows = await getDb().select().from(schema.episodes).where(eq(schema.episodes.status, "published"));
  return rows.map(toPublicEpisode);
}
export async function listPublishedStories() {
  const rows = await getDb().select().from(schema.stories).where(eq(schema.stories.status, "published"));
  return rows.map(toPublicStory);
}

/* ---------- Admin reads/writes ---------- */

export const tableFor = {
  article: schema.articles,
  doctor: schema.doctors,
  pharmacy: schema.pharmacies,
  service: schema.services,
  event: schema.events,
  episode: schema.episodes,
  story: schema.stories,
} as const;

export async function adminList(type: ContentType, status?: "draft" | "published") {
  const table = tableFor[type];
  const db = getDb();
  const rows = status
    ? await db.select().from(table).where(eq(table.status, status))
    : await db.select().from(table);
  // Rows already carry numeric id + status + sample + timestamps for the admin UI.
  return rows;
}

export async function adminCreate(type: ContentType, data: Record<string, unknown>) {
  const table = tableFor[type];
  const [{ id }] = await getDb()
    .insert(table)
    .values({ ...data, status: "draft" } as never)
    .$returningId();
  return { id };
}

export async function adminUpdate(type: ContentType, id: number, data: Record<string, unknown>) {
  const table = tableFor[type];
  await getDb().update(table).set(data as never).where(eq(table.id, id));
  return { id };
}

export async function adminSetStatus(type: ContentType, id: number, status: "draft" | "published") {
  const table = tableFor[type];
  await getDb().update(table).set({ status } as never).where(eq(table.id, id));
  return { id, status };
}

export async function adminRemove(type: ContentType, id: number) {
  const table = tableFor[type];
  await getDb().delete(table).where(eq(table.id, id));
  return { id };
}
