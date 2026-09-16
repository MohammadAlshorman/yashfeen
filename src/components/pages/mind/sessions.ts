import type { Localized } from '@/data/types'

/**
 * Mind session library — small local `Session` list within the Mind module
 * (mind.md §Section 2; intentionally NOT a global data type). All sample copy,
 * EN/AR-paired; no audio in MVP — cards carry scripts only.
 */
export type SessionGlyph = 'lotus' | 'chair' | 'moon' | 'wave' | 'steps' | 'pen'

export interface Session {
  id: string
  title: Localized
  /** 1-line description */
  desc: Localized
  mins: number
  glyph: SessionGlyph
  /** Script steps shown by the in-card preview accordion (text only) */
  steps: Localized[]
  /** True for sessions that touch anxiety/sleep — they carry the disclaimer micro-line */
  medical?: boolean
}

export const sessions: Session[] = [
  {
    id: 'morning-fog',
    title: { en: 'Morning fog-clearer', ar: 'مُبدّد ضباب الصباح' },
    desc: { en: 'Breath + intention to open the day.', ar: 'تنفّس ونيّة لافتتاح اليوم.' },
    mins: 3,
    glyph: 'lotus',
    steps: [
      { en: 'Sit tall, feet on the floor. Soften your shoulders.', ar: 'اجلس معتدلًا وقدماك على الأرض. أرخِ كتفيك.' },
      { en: 'Breathe in for 4, out for 6 — five slow rounds.', ar: 'شهيق في 4 عدّات وزفير في 6 — خمس جولات بطيئة.' },
      { en: 'Name one intention for today in a single sentence.', ar: 'سمِّ نيّة واحدة لليوم في جملة واحدة.' },
      { en: 'Open your eyes on the exhale. Begin.', ar: 'افتح عينيك مع الزفير. ابدأ.' },
    ],
  },
  {
    id: 'desk-reset',
    title: { en: 'Desk reset', ar: 'استراحة المكتب' },
    desc: { en: 'Seated stretch cues between meetings.', ar: 'تلميحات تمدّد وأنت جالس بين الاجتماعات.' },
    mins: 2,
    glyph: 'chair',
    steps: [
      { en: 'Both feet down. Unclench your jaw, drop your shoulders.', ar: 'قدماك على الأرض. أرخِ فكّك وأنزل كتفيك.' },
      { en: 'Roll your neck slowly — three circles each way.', ar: 'دوّر رقبتك ببطء — ثلاث دوائر بكل اتجاه.' },
      { en: 'Interlace fingers, press palms away, breathe out long.', ar: 'شبّك أصابعك وادفع راحتيك بعيدًا مع زفير طويل.' },
    ],
  },
  {
    id: 'pre-sleep',
    title: { en: 'Pre-sleep descent', ar: 'نزول ما قبل النوم' },
    desc: { en: 'A slow body scan for heavy evenings.', ar: 'مسح جسدي بطيء لأمسيات ثقيلة.' },
    mins: 8,
    glyph: 'moon',
    medical: true,
    steps: [
      { en: 'Lie down. Exhale longer than you inhale, three times.', ar: 'استلقِ. اجعل الزفير أطول من الشهيق، ثلاث مرات.' },
      { en: 'Scan from crown to toes, softening each region you meet.', ar: 'انتقل بانتباهك من قمة رأسك إلى أصابع قدميك، مُرخيًا كل منطقة تمرّ بها.' },
      { en: 'When thoughts arrive, label them “thinking” and return to the body.', ar: 'حين تأتي الأفكار، سمِّها «تفكير» وعُد إلى الجسد.' },
      { en: 'Let the last minute be silence.', ar: 'دع الدقيقة الأخيرة صمتًا.' },
    ],
  },
  {
    id: 'anxiety-first-aid',
    title: { en: 'Anxiety first-aid', ar: 'إسعاف القلق الأولي' },
    desc: { en: 'Extended exhale for racing moments.', ar: 'زفير ممدود للحظات التسارع.' },
    mins: 5,
    glyph: 'wave',
    medical: true,
    steps: [
      { en: 'Name five things you can see. Plant both feet.', ar: 'سمِّ خمسة أشياء تراها. ثبّت قدميك على الأرض.' },
      { en: 'Inhale for 4, exhale for 8 — the long out-breath is the medicine.', ar: 'شهيق 4 عدّات وزفير 8 — الزفير الطويل هو الدواء.' },
      { en: 'Repeat for ten rounds, slower each time.', ar: 'كرّر عشر جولات، أبطأ في كل مرة.' },
      { en: 'Notice: the wave peaked, and it passed.', ar: 'لاحظ: الموجة بلغت ذروتها ثم مضت.' },
    ],
  },
  {
    id: 'walking-citadel',
    title: { en: 'Walking meditation — Amman citadel loop', ar: 'تأمل المشي — جولة جبل القلعة في عمّان' },
    desc: { en: 'An audio-style script for a 12-minute walk.', ar: 'نص بأسلوب التوجيه الصوتي لمشية من اثنتي عشرة دقيقة.' },
    mins: 12,
    glyph: 'steps',
    steps: [
      { en: 'Start at the gate. Match breath to steps: in for 4, out for 4.', ar: 'ابدأ من البوابة. طابِق أنفاسك مع خطواتك: شهيق في 4 عدّات، وزفير في 4.' },
      { en: 'Let the city sounds come and go without chasing them.', ar: 'دع أصوات المدينة تأتي وتمضي دون أن تلاحقها.' },
      { en: 'At the columns, pause. Feel the altitude of the hill.', ar: 'عند الأعمدة، توقّف. اشعر بعلوّ الجبل.' },
      { en: 'Walk the loop back noticing one thing you never saw before.', ar: 'عُد في الجولة منتبهًا لشيء واحد لم تره من قبل.' },
    ],
  },
  {
    id: 'gratitude-three',
    title: { en: 'Gratitude in three lines', ar: 'الامتنان في ثلاثة أسطر' },
    desc: { en: 'A journaling prompt to close the day.', ar: 'تمرين كتابة لختام اليوم.' },
    mins: 4,
    glyph: 'pen',
    steps: [
      { en: 'Line one: something that went right today, however small.', ar: 'السطر الأول: شيء سار على ما يرام اليوم، مهما صغُر.' },
      { en: 'Line two: a person you are glad exists.', ar: 'السطر الثاني: شخص يسعدك وجوده.' },
      { en: 'Line three: something your body did for you today.', ar: 'السطر الثالث: شيء فعله جسدك من أجلك اليوم.' },
      { en: 'Read the three lines aloud. Close the notebook.', ar: 'اقرأ الأسطر الثلاثة بصوت مسموع. أغلق الدفتر.' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Quiet facts strip (mind.md §Section 3) — real, sourced sample facts */
/* ------------------------------------------------------------------ */
export interface QuietFact {
  id: string
  text: Localized
  source: Localized
}

export const quietFacts: QuietFact[] = [
  {
    id: 'six-breaths',
    text: {
      en: 'Slow breathing at ~6 breaths/min is associated with a reduced stress response.',
      ar: 'التنفّس البطيء بمعدل ~6 أنفاس في الدقيقة يرتبط بانخفاض استجابة التوتّر.',
    },
    source: {
      en: 'Published physiology reviews — sample',
      ar: 'مراجعات فسيولوجية منشورة — عيّنة',
    },
  },
  {
    id: 'one-minute',
    text: {
      en: 'One minute of paced breathing can steady a racing moment.',
      ar: 'دقيقة واحدة من التنفّس المنتظم تكفي لتهدئة لحظة متسارعة.',
    },
    source: {
      en: 'Yashfeen studio practice note — sample',
      ar: 'ملاحظة تطبيقية من استوديو يشفين — عيّنة',
    },
  },
  {
    id: 'consistency',
    text: {
      en: 'Consistency beats duration: 60 seconds daily beats 20 minutes rarely.',
      ar: 'المواظبة تغلب المدة: ستون ثانية يوميًا خير من عشرين دقيقة بين الحين والحين.',
    },
    source: {
      en: 'Habit research summaries — sample',
      ar: 'ملخّصات أبحاث العادات — عيّنة',
    },
  },
]
