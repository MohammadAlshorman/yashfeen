import { count, eq } from "drizzle-orm";
import { getDb } from "../api/queries/connection";
import * as schema from "./schema";

// Seed source: the original typed local data layer (30 sample entries).
// Imported from the frontend modules directly (they are alias-free pure TS).
import { articles } from "../src/data/articles";
import { doctors } from "../src/data/doctors";
import { pharmacies } from "../src/data/pharmacies";
import { services } from "../src/data/services";
import { events } from "../src/data/events";
import { episodes } from "../src/data/episodes";
import { stories } from "../src/data/stories";

const unpair = (list: { en: string; ar: string }[]) => ({
  en: list.map((l) => l.en),
  ar: list.map((l) => l.ar),
});

/**
 * IDEMPOTENT seeding.
 *
 * Every content table carries a `sample` flag. A table is only seeded
 * when it contains no sample rows yet, so `npm run db:setup` can be run
 * repeatedly (and safely on every deploy) without creating duplicates
 * and without ever touching content written through the CMS.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedIfEmpty(label: string, table: any, rows: any[]): Promise<boolean> {
  const db = getDb();
  const [{ n }] = await db
    .select({ n: count() })
    .from(table)
    .where(eq(table.sample, true));
  if (Number(n) > 0) {
    console.log(`  ${label}: ${n} sample rows already present — skipped`);
    return false;
  }
  await db.insert(table).values(rows);
  console.log(`  ${label}: inserted ${rows.length} sample rows`);
  return true;
}

async function seed() {
  console.log("Seeding Yashfeen CMS content (30 sample entries, published)...");

  await seedIfEmpty(
    "articles",
    schema.articles,
    articles.map((a) => {
      const body = unpair(a.body);
      return {
        slug: a.slug,
        titleEn: a.title.en, titleAr: a.title.ar,
        dekEn: a.dek.en, dekAr: a.dek.ar,
        category: a.category,
        categoryLabelEn: a.categoryLabel.en, categoryLabelAr: a.categoryLabel.ar,
        bodyEn: body.en, bodyAr: body.ar,
        sourceNameEn: a.source.name.en, sourceNameAr: a.source.name.ar,
        sourceUrl: a.source.url,
        publishedAt: a.publishedAt,
        readMins: a.readMins,
        status: "published" as const,
        sample: true,
      };
    }),
  );

  await seedIfEmpty(
    "doctors",
    schema.doctors,
    doctors.map((d) => ({
      nameEn: d.name.en, nameAr: d.name.ar,
      specialtyEn: d.specialty.en, specialtyAr: d.specialty.ar,
      languages: d.languages,
      clinicEn: d.clinic.en, clinicAr: d.clinic.ar,
      cityEn: d.city.en, cityAr: d.city.ar,
      phone: d.phone,
      verified: d.verified,
      bioEn: d.bio.en, bioAr: d.bio.ar,
      slots: d.slots,
      sourceNameEn: d.source.name.en, sourceNameAr: d.source.name.ar,
      sourceUrl: d.source.url,
      updateEn: d.update.en, updateAr: d.update.ar,
      updateSourceEn: d.updateSource.en, updateSourceAr: d.updateSource.ar,
      updateDate: d.updateDate,
      status: "published" as const,
      sample: true,
    })),
  );

  await seedIfEmpty(
    "pharmacies",
    schema.pharmacies,
    pharmacies.map((p) => ({
      nameEn: p.name.en, nameAr: p.name.ar,
      areaEn: p.area.en, areaAr: p.area.ar,
      cityEn: p.city.en, cityAr: p.city.ar,
      hoursEn: p.hours.en, hoursAr: p.hours.ar,
      onDuty: p.onDuty,
      phone: p.phone,
      verified: p.verified,
      sourceNameEn: p.source.name.en, sourceNameAr: p.source.name.ar,
      sourceUrl: p.source.url,
      updateEn: p.update.en, updateAr: p.update.ar,
      updateSourceEn: p.updateSource.en, updateSourceAr: p.updateSource.ar,
      updateDate: p.updateDate,
      status: "published" as const,
      sample: true,
    })),
  );

  await seedIfEmpty(
    "services",
    schema.services,
    services.map((s) => ({
      nameEn: s.name.en, nameAr: s.name.ar,
      type: s.type,
      cityEn: s.city.en, cityAr: s.city.ar,
      priceFrom: s.priceFrom,
      providerEn: s.provider.en, providerAr: s.provider.ar,
      sourceNameEn: s.source.name.en, sourceNameAr: s.source.name.ar,
      sourceUrl: s.source.url,
      status: "published" as const,
      sample: true,
    })),
  );

  await seedIfEmpty(
    "events",
    schema.events,
    events.map((e) => ({
      titleEn: e.title.en, titleAr: e.title.ar,
      category: e.category,
      date: e.date,
      timeEn: e.time.en, timeAr: e.time.ar,
      cityEn: e.city.en, cityAr: e.city.ar,
      venueEn: e.venue.en, venueAr: e.venue.ar,
      hostEn: e.host.en, hostAr: e.host.ar,
      free: e.free,
      price: e.price ?? null,
      sourceNameEn: e.source.name.en, sourceNameAr: e.source.name.ar,
      sourceUrl: e.source.url,
      status: "published" as const,
      sample: true,
    })),
  );

  await seedIfEmpty(
    "episodes",
    schema.episodes,
    episodes.map((e) => {
      const guests = unpair(e.guests);
      const topics = unpair(e.topics);
      return {
        number: e.number,
        titleEn: e.title.en, titleAr: e.title.ar,
        guestsEn: guests.en, guestsAr: guests.ar,
        airedAt: e.airedAt,
        durationMins: e.durationMins,
        topicsEn: topics.en, topicsAr: topics.ar,
        summaryEn: e.summary.en, summaryAr: e.summary.ar,
        notesEn: e.notes.en, notesAr: e.notes.ar,
        status: "published" as const,
        sample: true,
      };
    }),
  );

  await seedIfEmpty(
    "stories",
    schema.stories,
    stories.map((s) => {
      const body = unpair(s.body);
      return {
        authorEn: s.author.en, authorAr: s.author.ar,
        cityEn: s.city.en, cityAr: s.city.ar,
        titleEn: s.title.en, titleAr: s.title.ar,
        quoteEn: s.quote.en, quoteAr: s.quote.ar,
        excerptEn: s.excerpt.en, excerptAr: s.excerpt.ar,
        bodyEn: body.en, bodyAr: body.ar,
        destination: s.destination ?? null,
        destinationLabelEn: s.destinationLabel?.en ?? null,
        destinationLabelAr: s.destinationLabel?.ar ?? null,
        moodTag: s.moodTag,
        status: "published" as const,
        sample: true,
      };
    }),
  );

  console.log("Seed complete (idempotent — safe to re-run).");
  process.exit(0); // close MySQL connection pool
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
