import { getDb } from "../api/queries/connection";
import { eq, and } from "drizzle-orm";
import * as schema from "./schema";

// One-off sync: refresh all *Ar columns of sample rows from the local data
// layer after the professional Arabic editorial pass. Matches rows on the
// untouched English unique fields; only sample=true rows are updated so any
// admin-created content is never touched.
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

async function sync() {
  const db = getDb();
  let updated = 0;
  let missed: string[] = [];

  for (const a of articles) {
    const body = unpair(a.body);
    const r = await db
      .update(schema.articles)
      .set({
        titleAr: a.title.ar,
        dekAr: a.dek.ar,
        categoryLabelAr: a.categoryLabel.ar,
        bodyAr: body.ar,
        sourceNameAr: a.source.name.ar,
      })
      .where(and(eq(schema.articles.sample, true), eq(schema.articles.titleEn, a.title.en)));
    updated += r[0].affectedRows;
    if (r[0].affectedRows === 0) missed.push(`article:${a.title.en}`);
  }

  for (const d of doctors) {
    const r = await db
      .update(schema.doctors)
      .set({
        nameAr: d.name.ar,
        specialtyAr: d.specialty.ar,
        clinicAr: d.clinic.ar,
        cityAr: d.city.ar,
        bioAr: d.bio.ar,
        sourceNameAr: d.source.name.ar,
        updateAr: d.update.ar,
        updateSourceAr: d.updateSource.ar,
      })
      .where(and(eq(schema.doctors.sample, true), eq(schema.doctors.nameEn, d.name.en)));
    updated += r[0].affectedRows;
    if (r[0].affectedRows === 0) missed.push(`doctor:${d.name.en}`);
  }

  for (const p of pharmacies) {
    const r = await db
      .update(schema.pharmacies)
      .set({
        nameAr: p.name.ar,
        areaAr: p.area.ar,
        cityAr: p.city.ar,
        hoursAr: p.hours.ar,
        sourceNameAr: p.source.name.ar,
        updateAr: p.update.ar,
        updateSourceAr: p.updateSource.ar,
      })
      .where(and(eq(schema.pharmacies.sample, true), eq(schema.pharmacies.nameEn, p.name.en)));
    updated += r[0].affectedRows;
    if (r[0].affectedRows === 0) missed.push(`pharmacy:${p.name.en}`);
  }

  for (const s of services) {
    const r = await db
      .update(schema.services)
      .set({
        nameAr: s.name.ar,
        cityAr: s.city.ar,
        providerAr: s.provider.ar,
        sourceNameAr: s.source.name.ar,
      })
      .where(and(eq(schema.services.sample, true), eq(schema.services.nameEn, s.name.en)));
    updated += r[0].affectedRows;
    if (r[0].affectedRows === 0) missed.push(`service:${s.name.en}`);
  }

  for (const e of events) {
    const r = await db
      .update(schema.events)
      .set({
        titleAr: e.title.ar,
        timeAr: e.time.ar,
        cityAr: e.city.ar,
        venueAr: e.venue.ar,
        hostAr: e.host.ar,
        sourceNameAr: e.source.name.ar,
      })
      .where(and(eq(schema.events.sample, true), eq(schema.events.titleEn, e.title.en)));
    updated += r[0].affectedRows;
    if (r[0].affectedRows === 0) missed.push(`event:${e.title.en}`);
  }

  for (const e of episodes) {
    const guests = unpair(e.guests);
    const topics = unpair(e.topics);
    const r = await db
      .update(schema.episodes)
      .set({
        titleAr: e.title.ar,
        guestsAr: guests.ar,
        topicsAr: topics.ar,
        summaryAr: e.summary.ar,
        notesAr: e.notes.ar,
      })
      .where(and(eq(schema.episodes.sample, true), eq(schema.episodes.titleEn, e.title.en)));
    updated += r[0].affectedRows;
    if (r[0].affectedRows === 0) missed.push(`episode:${e.title.en}`);
  }

  for (const s of stories) {
    const body = unpair(s.body);
    const r = await db
      .update(schema.stories)
      .set({
        authorAr: s.author.ar,
        cityAr: s.city.ar,
        titleAr: s.title.ar,
        quoteAr: s.quote.ar,
        excerptAr: s.excerpt.ar,
        bodyAr: body.ar,
        destinationLabelAr: s.destinationLabel?.ar ?? null,
      })
      .where(and(eq(schema.stories.sample, true), eq(schema.stories.titleEn, s.title.en)));
    updated += r[0].affectedRows;
    if (r[0].affectedRows === 0) missed.push(`story:${s.title.en}`);
  }

  console.log(`Arabic sync complete: ${updated} sample rows updated.`);
  if (missed.length) console.log("No matching sample row for:", missed);
  process.exit(0);
}

sync().catch((err) => {
  console.error("Arabic sync failed:", err);
  process.exit(1);
});
