import { CountdownHero } from '@/components/pages/live/CountdownHero'
import { GuestLineup } from '@/components/pages/live/GuestLineup'
import { PastEpisodes } from '@/components/pages/live/PastEpisodes'
import { AskBand } from '@/components/pages/live/AskBand'

/**
 * Live — `/live` (live.md). The weekly Yashfeen show page.
 * §1 Wadi Night hero band + countdown to next Thursday 20:00 Asia/Amman.
 * §2 Guest lineup (host card variant + 3 segments).
 * §3 Past episodes archive (detail modal, honest player placeholder).
 * §4 Question-for-the-show band (success UI state only — nothing is sent).
 * Anemone Red is reserved here for the LIVE identity and never mood-shifts.
 */
export default function Live() {
  return (
    <>
      <CountdownHero />
      <GuestLineup />
      <PastEpisodes />
      <AskBand />
    </>
  )
}
