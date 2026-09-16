export interface SmsOptInResult {
  ok: true
  /** Masked confirmation, e.g. "+962 7• ••• ••34" */
  maskedPhone: string
}

// STUB: wire to an SMS gateway (POST /sms-opt-in { phone } → OTP flow) when the
// backend exists. This stub performs NO network call and sends no SMS; it returns
// mock success after 400ms so opt-in UI states can be built.
export async function optInToSms(phone: string): Promise<SmsOptInResult> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const digits = phone.replace(/\D/g, '')
  const last2 = digits.slice(-2).padStart(2, '0')
  return { ok: true, maskedPhone: `+962 7• ••• ••${last2}` }
}
