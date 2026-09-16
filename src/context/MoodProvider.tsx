import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { MOODS, MOOD_STORAGE_KEY, isMoodId } from '@/lib/moods'
import type { MoodId } from '@/lib/moods'
import { MoodPrompt } from '@/components/MoodPrompt'

interface MoodContextValue {
  mood: MoodId
  setMood: (mood: MoodId) => void
  /** True once a mood exists in localStorage (first visit = false → prompt) */
  hasChosen: boolean
  promptOpen: boolean
  openPrompt: () => void
  closePrompt: () => void
}

const MoodContext = createContext<MoodContextValue | null>(null)

function readInitialMood(): { mood: MoodId; hasChosen: boolean } {
  try {
    const stored = localStorage.getItem(MOOD_STORAGE_KEY)
    if (isMoodId(stored)) return { mood: stored, hasChosen: true }
  } catch {
    /* ignore */
  }
  return { mood: 'calm', hasChosen: false }
}

export function MoodProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(readInitialMood)
  const [mood, setMoodState] = useState<MoodId>(initial.mood)
  const [hasChosen, setHasChosen] = useState(initial.hasChosen)
  const [promptOpen, setPromptOpen] = useState(false)

  const setMood = (next: MoodId) => {
    setMoodState(next)
    setHasChosen(true)
    try {
      localStorage.setItem(MOOD_STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  // Apply the mood CSS vars to <html> (§2.2). Crossfades via CSS transitions (800ms).
  useEffect(() => {
    const def = MOODS[mood]
    const root = document.documentElement
    root.style.setProperty('--mood-accent', def.accent)
    root.style.setProperty('--mood-accent-deep', def.accentDeep)
    root.style.setProperty('--mood-accent-soft-light', def.accentSoft)
    root.style.setProperty('--mood-glow', def.glow)
    root.style.setProperty('--mood-ambiance', def.ambiance)
    root.style.setProperty('--mood-sun-1', def.sunHue[0])
    root.style.setProperty('--mood-sun-2', def.sunHue[1])
  }, [mood])

  const value = useMemo<MoodContextValue>(
    () => ({
      mood,
      setMood,
      hasChosen,
      promptOpen,
      openPrompt: () => setPromptOpen(true),
      closePrompt: () => setPromptOpen(false),
    }),
    [mood, hasChosen, promptOpen],
  )

  return (
    <MoodContext.Provider value={value}>
      {children}
      <MoodPrompt />
    </MoodContext.Provider>
  )
}

export function useMood(): MoodContextValue {
  const ctx = useContext(MoodContext)
  if (!ctx) throw new Error('useMood must be used inside <MoodProvider>')
  return ctx
}
