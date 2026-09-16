/**
 * Next Yashfeen Live show: Thursdays 20:00 Asia/Amman.
 * Jordan observes permanent UTC+3, so the show is 17:00 UTC.
 */
export function nextShowTime(from: number = Date.now()): number {
  const d = new Date(from)
  let candidate = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 17, 0, 0)
  for (let i = 0; i < 8; i++) {
    if (new Date(candidate).getUTCDay() === 4 && candidate > from) return candidate
    candidate += 86_400_000
  }
  return candidate
}

export interface CountdownParts {
  days: number
  hours: number
  mins: number
}

/** dd:hh:mm breakdown (Western numerals, stays dir="ltr" in RTL — §2.9). */
export function countdownParts(target: number, from: number = Date.now()): CountdownParts {
  const total = Math.max(0, Math.floor((target - from) / 60_000))
  return {
    days: Math.floor(total / 1440),
    hours: Math.floor((total % 1440) / 60),
    mins: total % 60,
  }
}
