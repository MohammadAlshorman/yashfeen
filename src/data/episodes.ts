import type { Episode } from './types'

/** 3 sample past Episodes (live.md §Sample episodes) — EN/AR paired, `_sample: true`. */
export const episodes: Episode[] = [
  {
    _sample: true,
    id: 'ep-11',
    number: 11,
    title: { en: 'Sleep, screens, and teenagers', ar: 'النوم والشاشات والمراهقون' },
    guests: [
      { en: 'Dr. Rawan Odeh', ar: 'د. روان عودة' },
      { en: 'A school counselor', ar: 'مرشدة مدرسية' },
    ],
    airedAt: '2025-05-08',
    durationMins: 54,
    topics: [
      { en: 'sleep', ar: 'النوم' },
      { en: 'teens', ar: 'المراهقون' },
      { en: 'screens', ar: 'الشاشات' },
    ],
    summary: {
      en: 'Why school-night sleep debt accumulates faster than parents think, what evening screens actually do to a teenage brain, and house rules that survive real life.',
      ar: 'لماذا يتراكم دَين النوم في ليالي الدراسة أسرع مما يظن الأهل، وما الذي تفعله شاشات المساء فعلًا بدماغ المراهق، وقواعد منزلية تصمد أمام الواقع.',
    },
    notes: {
      en: 'Episode notes: the UJ screen-time study explained simply; the 45-minute screens-down window; when sleep problems need a doctor; questions from listeners about gaming and exams week.',
      ar: 'ملاحظات الحلقة: شرح مبسط لدراسة الجامعة الأردنية حول الشاشات؛ مهلة الـ٤٥ دقيقة بلا شاشات؛ متى تستدعي مشكلات النوم طبيبًا؛ أسئلة المستمعين عن الألعاب وأسبوع الامتحانات.',
    },
  },
  {
    _sample: true,
    id: 'ep-10',
    number: 10,
    title: { en: 'Walking Amman: the 10,000-step myth', ar: 'المشي في عمّان: أسطورة العشرة آلاف خطوة' },
    guests: [{ en: 'Physiotherapist Leen Barakat', ar: 'أخصائية العلاج الطبيعي لين بركات' }],
    airedAt: '2025-05-01',
    durationMins: 47,
    topics: [
      { en: 'movement', ar: 'الحركة' },
      { en: 'myths', ar: 'الخرافات' },
    ],
    summary: {
      en: 'Where the 10,000-step number came from (hint: marketing), what the research actually supports, and how to build a walking habit around Amman’s hills.',
      ar: 'من أين جاء رقم العشرة آلاف خطوة (تلميح: التسويق)، وما الذي تدعمه الأبحاث فعلًا، وكيف تبني عادة مشي تناسب تلال عمّان.',
    },
    notes: {
      en: 'Episode notes: the real dose-response curve for steps; three walking routes for beginners; comfortable footwear basics; the free GAM walking groups schedule.',
      ar: 'ملاحظات الحلقة: منحنى الجرعة والاستجابة الحقيقي للخطوات؛ ثلاثة مسارات مشي للمبتدئين؛ أساسيات الأحذية المريحة؛ جدول مجموعات المشي المجانية التابعة للأمانة.',
    },
  },
  {
    _sample: true,
    id: 'ep-09',
    number: 9,
    title: { en: 'Ramadan rhythms: eating and energy', ar: 'إيقاعات رمضان: الأكل والطاقة' },
    guests: [{ en: 'Dietitian Omar Haddad', ar: 'أخصائي التغذية عمر حداد' }],
    airedAt: '2025-04-24',
    durationMins: 61,
    topics: [
      { en: 'nutrition', ar: 'التغذية' },
      { en: 'fasting', ar: 'الصيام' },
    ],
    summary: {
      en: 'How to structure iftar and suhoor for steady energy, hydration strategy through long days, and what to do about the 4pm slump.',
      ar: 'كيف تنظم الإفطار والسحور لطاقة مستقرة، واستراتيجية الترطيب في الأيام الطويلة، وما الحل لخمول الرابعة عصرًا.',
    },
    notes: {
      en: 'Episode notes: plate-by-plate iftar order; suhoor foods that last; caffeine timing; exercising while fasting — what’s sensible and what’s not.',
      ar: 'ملاحظات الحلقة: ترتيب أطباق الإفطار خطوة بخطوة؛ أطعمة سحور تدوم؛ توقيت الكافيين؛ الرياضة أثناء الصيام — ما المعقول وما المبالغة.',
    },
  },
]
