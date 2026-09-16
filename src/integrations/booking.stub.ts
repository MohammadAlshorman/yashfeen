export interface BookingRequest {
  providerId: string
  slot: string
  name: string
  phone: string
  note?: string
}

export interface BookingResult {
  ok: true
  /** Client-side sample reference, e.g. AF-2025-0417 */
  reference: string
}

// STUB: POST /booking-requests { providerId, slot, name, phone, note } when the
// booking backend exists. This stub performs NO network call; it resolves a mock
// success after 400ms with a client-generated reference number. Nothing is sent.
export async function submitBookingRequest(req: BookingRequest): Promise<BookingResult> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  void req
  const now = new Date()
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const rand = Math.floor(1000 + Math.random() * 9000)
  return { ok: true, reference: `AF-${stamp}-${rand}` }
}
