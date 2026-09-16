import { createRouter, publicQuery } from "./middleware";
import {
  listPublishedArticles,
  listPublishedDoctors,
  listPublishedPharmacies,
  listPublishedServices,
  listPublishedEvents,
  listPublishedEpisodes,
  listPublishedStories,
} from "./queries/content";

/** Public Yashfeen content API — published rows only, frontend-compatible shapes. */
export const contentRouter = createRouter({
  articles: publicQuery.query(() => listPublishedArticles()),
  doctors: publicQuery.query(() => listPublishedDoctors()),
  pharmacies: publicQuery.query(() => listPublishedPharmacies()),
  services: publicQuery.query(() => listPublishedServices()),
  events: publicQuery.query(() => listPublishedEvents()),
  episodes: publicQuery.query(() => listPublishedEpisodes()),
  stories: publicQuery.query(() => listPublishedStories()),
});
