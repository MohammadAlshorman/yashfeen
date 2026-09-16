import { createRouter, adminQuery } from "./middleware";
import {
  createContentInput,
  updateContentInput,
  setStatusInput,
  removeContentInput,
  listContentInput,
} from "@contracts/content";
import {
  adminList,
  adminCreate,
  adminUpdate,
  adminSetStatus,
  adminRemove,
} from "./queries/content";

/**
 * Admin CMS API — requires a signed-in user with role=admin
 * (env-based admin login; see api/auth-router.ts).
 * Creates land as `draft`; publish/unpublish is an explicit action.
 */
export const adminRouter = createRouter({
  list: adminQuery
    .input(listContentInput)
    .query(({ input }) => adminList(input.type, input.status)),

  create: adminQuery
    .input(createContentInput)
    .mutation(({ input }) => adminCreate(input.type, input.data)),

  update: adminQuery
    .input(updateContentInput)
    .mutation(({ input }) => adminUpdate(input.type, input.id, input.data)),

  setStatus: adminQuery
    .input(setStatusInput)
    .mutation(({ input }) => adminSetStatus(input.type, input.id, input.status)),

  remove: adminQuery
    .input(removeContentInput)
    .mutation(({ input }) => adminRemove(input.type, input.id)),
});
