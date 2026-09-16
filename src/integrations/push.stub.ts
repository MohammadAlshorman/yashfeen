export interface PushOptInResult {
  ok: true
  /** Fake subscription id for UI-state development only */
  subscriptionId: string
}

// STUB: wire to Web Push (PushManager.subscribe + POST /push-subscriptions) when the
// backend exists. This stub performs NO network call and never requests real browser
// permission; it returns mock success after 400ms so opt-in UI states can be built.
export async function subscribeToPush(channel: 'news' | 'events' | 'live'): Promise<PushOptInResult> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return { ok: true, subscriptionId: `push-${channel}-sample` }
}

// STUB: DELETE /push-subscriptions/:id — mock unsubscribe after 400ms.
export async function unsubscribeFromPush(subscriptionId: string): Promise<{ ok: true }> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  void subscriptionId
  return { ok: true }
}
