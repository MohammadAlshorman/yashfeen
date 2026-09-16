import type { Article } from './types'

/** 6 sample Articles (news.md §Sample data) — EN/AR paired, `_sample: true`. */
export const articles: Article[] = [
  {
    _sample: true,
    id: 'art-01',
    slug: 'school-vaccination-days-autumn',
    title: {
      en: 'Jordan expands school vaccination days this autumn',
      ar: 'الأردن يوسّع أيام التطعيم المدرسي هذا الخريف',
    },
    dek: {
      en: 'Mobile clinic teams will visit public schools in all twelve governorates, with catch-up doses for children who missed appointments.',
      ar: 'ستزور فرق العيادات المتنقلة المدارس الحكومية في محافظات المملكة الاثنتي عشرة، مع جرعات تعويضية للأطفال الذين فاتتهم مواعيدهم.',
    },
    category: 'public-health',
    categoryLabel: { en: 'Public Health', ar: 'الصحة العامة' },
    body: [
      {
        en: 'The Ministry of Health has expanded its school vaccination program for the autumn term, sending mobile clinic teams to public schools across all twelve governorates.',
        ar: 'وسّعت وزارة الصحة برنامج التطعيم المدرسي للفصل الدراسي الخريفي، فسترسل فرق عيادات متنقلة إلى المدارس الحكومية في محافظات المملكة كافة.',
      },
      {
        en: 'Children who missed earlier appointments can receive catch-up doses during the visits, and parents receive a printed schedule through schools.',
        ar: 'يمكن للأطفال الذين فاتتهم مواعيد سابقة الحصول على جرعات تعويضية أثناء الزيارات، ويتسلم الأهل جدولًا مطبوعًا عبر المدارس.',
      },
      {
        en: 'Health officials emphasize that routine immunization remains one of the most effective public-health tools, and encourage parents to check their children’s records.',
        ar: 'يؤكد مسؤولو الصحة أن التحصين الروتيني يبقى من أكثر أدوات الصحة العامة فعالية، ويشجعون الأهل على مراجعة سجلات أطفالهم.',
      },
    ],
    source: { name: { en: 'Ministry of Health bulletin', ar: 'نشرة وزارة الصحة' }, url: '#' },
    publishedAt: '2025-05-06',
    readMins: 3,
    disclaimer: true,
  },
  {
    _sample: true,
    id: 'art-02',
    slug: 'olive-harvest-mediterranean-heart',
    title: {
      en: 'Olive harvest season: what the Mediterranean table does for your heart',
      ar: 'موسم قطف الزيتون: ما الذي تقدمه المائدة المتوسطية لقلبك',
    },
    dek: {
      en: 'Fresh-pressed olive oil, legumes, and seasonal vegetables — dietitians on why Jordan’s autumn table is quietly cardioprotective.',
      ar: 'زيت الزيتون الطازج والبقوليات وخضار الموسم — اختصاصيو تغذية يشرحون لماذا تُعد مائدة الخريف الأردنية وقاية هادئة للقلب.',
    },
    category: 'nutrition',
    categoryLabel: { en: 'Nutrition', ar: 'التغذية' },
    body: [
      {
        en: 'As olive harvest season begins across the north of Jordan, dietitians point out that the traditional autumn table — fresh-pressed oil, lentils, and seasonal greens — closely mirrors the Mediterranean dietary pattern linked to better cardiovascular outcomes.',
        ar: 'مع بدء موسم قطف الزيتون في شمال الأردن، يشير اختصاصيو التغذية إلى أن المائدة الخريفية التقليدية — زيت الزيتون الطازج والعدس وخضار الموسم — تطابق إلى حد كبير النمط الغذائي المتوسطي المرتبط بصحة قلبية أفضل.',
      },
      {
        en: 'The pattern is rich in monounsaturated fats, fiber, and polyphenols, and light on ultra-processed food.',
        ar: 'هذا النمط غني بالدهون الأحادية غير المشبعة والألياف والبوليفينولات، وفقير بالأغذية فائقة المعالجة.',
      },
      {
        en: 'Small, consistent habits matter more than short diets: a drizzle of olive oil instead of butter, beans twice a week, and fruit as dessert.',
        ar: 'العادات الصغيرة الثابتة أهم من الحميات القصيرة: رشّة زيت زيتون بدلًا من الزبدة، وبقوليات مرتين في الأسبوع، وفاكهة للتحلية.',
      },
    ],
    source: { name: { en: 'Jordan Dietitians Association', ar: 'جمعية اختصاصيي التغذية الأردنية' }, url: '#' },
    publishedAt: '2025-05-04',
    readMins: 4,
    disclaimer: true,
  },
  {
    _sample: true,
    id: 'art-03',
    slug: 'evening-screens-teen-sleep-debt',
    title: {
      en: 'University of Jordan study links evening screen time to sleep debt in teens',
      ar: 'دراسة للجامعة الأردنية تربط شاشات المساء بدَين النوم لدى المراهقين',
    },
    dek: {
      en: 'Researchers found each additional hour of late-evening screen use correlated with measurably shorter sleep on school nights.',
      ar: 'وجد الباحثون أن كل ساعة إضافية من استخدام الشاشات في المساء المتأخر ارتبطت بنوم أقصر بمقدار ملموس في ليالي الدراسة.',
    },
    category: 'mental-health',
    categoryLabel: { en: 'Mental Health', ar: 'الصحة النفسية' },
    body: [
      {
        en: 'A University of Jordan Faculty of Medicine study following secondary-school students found a consistent link between late-evening screen use and accumulated sleep debt during the school week.',
        ar: 'وجدت دراسة لكلية الطب في الجامعة الأردنية تابعت طلاب المرحلة الثانوية ارتباطًا ثابتًا بين استخدام الشاشات في المساء المتأخر وتراكم دَين النوم خلال أسبوع الدراسة.',
      },
      {
        en: 'The effect was strongest for interactive use — messaging and gaming — in the hour before bed.',
        ar: 'كان التأثير أقوى مع الاستخدام التفاعلي — المراسلة والألعاب — في الساعة التي تسبق النوم.',
      },
      {
        en: 'The authors suggest a household "screens-down" window 45 minutes before sleep rather than strict bans, which teens rarely keep.',
        ar: 'يقترح الباحثون مهلة منزلية «بلا شاشات» قبل النوم بخمس وأربعين دقيقة، بدلًا من المنع الصارم الذي نادرًا ما يلتزم به المراهقون.',
      },
    ],
    source: { name: { en: 'UJ Faculty of Medicine', ar: 'كلية الطب — الجامعة الأردنية' }, url: '#' },
    publishedAt: '2025-05-02',
    readMins: 5,
    disclaimer: true,
  },
  {
    _sample: true,
    id: 'art-04',
    slug: 'dead-sea-minerals-dermatology-trials',
    title: {
      en: 'Dead Sea minerals in dermatology: what the trials actually show',
      ar: 'معادن البحر الميت في طب الجلد: ما الذي تظهره التجارب فعلًا',
    },
    dek: {
      en: 'Magnesium-rich Dead Sea salts show real promise for certain skin conditions — but the evidence is narrower than the marketing.',
      ar: 'أملاح البحر الميت الغنية بالمغنيسيوم تُظهر نتائج واعدة لبعض الحالات الجلدية — لكن الأدلة أضيق مما يوحي به التسويق.',
    },
    category: 'research',
    categoryLabel: { en: 'Research', ar: 'الأبحاث' },
    body: [
      {
        en: 'A digest of clinical trials on Dead Sea balneotherapy finds the strongest evidence for psoriasis symptom relief, with smaller but positive results for atopic dermatitis.',
        ar: 'وجدت خلاصة للتجارب السريرية حول العلاج بمياه البحر الميت أقوى الأدلة في تخفيف أعراض الصدفية، مع نتائج إيجابية أصغر للتهاب الجلد التأتبي.',
      },
      {
        en: 'Researchers attribute much of the effect to magnesium-rich salts improving skin barrier hydration, combined with the area’s unique filtered sunlight.',
        ar: 'يعزو الباحثون جزءًا كبيرًا من التأثير إلى الأملاح الغنية بالمغنيسيوم التي تحسّن ترطيب حاجز الجلد، إضافة إلى أشعة الشمس المُرشَّحة الفريدة في المنطقة.',
      },
      {
        en: 'The digest cautions that cosmetic "Dead Sea" products vary widely and are not equivalent to supervised climatotherapy at the shore.',
        ar: 'تحذّر الخلاصة من أن المنتجات التجميلية التي تحمل اسم «البحر الميت» تتفاوت كثيرًا، ولا تعادل العلاج المناخي الموجَّه على الشاطئ.',
      },
    ],
    source: { name: { en: 'Royal Medical Services journal digest', ar: 'خلاصة مجلة الخدمات الطبية الملكية' }, url: '#' },
    publishedAt: '2025-04-28',
    readMins: 6,
    disclaimer: true,
  },
  {
    _sample: true,
    id: 'art-05',
    slug: 'health-insurance-retirees-2025',
    title: {
      en: 'Health insurance coverage: what changes for retirees in 2025',
      ar: 'التغطية التأمينية الصحية: ما الذي يتغير للمتقاعدين في 2025',
    },
    dek: {
      en: 'A summary of the approved changes to retiree coverage tiers, referral rules, and the chronic-medication dispensing window.',
      ar: 'ملخص للتغييرات المعتمدة على شرائح تغطية المتقاعدين وقواعد التحويل وفترة صرف أدوية الأمراض المزمنة.',
    },
    category: 'policy',
    categoryLabel: { en: 'Policy', ar: 'السياسات' },
    body: [
      {
        en: 'The National Health Council has published its summary of changes to retiree health coverage taking effect this year, including revised referral rules for specialist visits.',
        ar: 'نشر المجلس الصحي الوطني ملخصه للتغييرات على التغطية الصحية للمتقاعدين والتي تدخل حيز التنفيذ هذا العام، ومنها قواعد محدثة لتحويلات العيادات الاختصاصية.',
      },
      {
        en: 'Chronic-medication dispensing windows move from monthly to two-month cycles for stable conditions, reducing repeat visits for long-term prescriptions.',
        ar: 'تنتقل فترات صرف أدوية الأمراض المزمنة من دورة شهرية إلى دورة شهرين للحالات المستقرة، ما يقلّل الزيارات المتكررة للوصفات طويلة الأمد.',
      },
      {
        en: 'Retirees are advised to confirm their tier through official channels before booking non-urgent procedures.',
        ar: 'يُنصح المتقاعدون بتأكيد شريحتهم عبر القنوات الرسمية قبل حجز أي إجراءات غير طارئة.',
      },
    ],
    source: { name: { en: 'National Health Council summary', ar: 'ملخص المجلس الصحي الوطني' }, url: '#' },
    publishedAt: '2025-04-25',
    readMins: 3,
    disclaimer: true,
  },
  {
    _sample: true,
    id: 'art-06',
    slug: 'walking-groups-amman-community-medicine',
    title: {
      en: 'Walking groups in Amman: community movement as medicine',
      ar: 'مجموعات المشي في عمّان: حين تصبح الحركة الجماعية دواءً',
    },
    dek: {
      en: 'Free morning walking groups in neighborhood parks are drawing hundreds — and participants report better mood before better fitness.',
      ar: 'مجموعات المشي الصباحية المجانية في حدائق الأحياء تجتذب المئات — ويتحدث المشاركون عن تحسّن المزاج قبل تحسّن اللياقة.',
    },
    category: 'mental-health',
    categoryLabel: { en: 'Mental Health', ar: 'الصحة النفسية' },
    body: [
      {
        en: 'Greater Amman Municipality’s community walking program now runs free guided morning walks in eight neighborhood parks, from Al-Hussein to King Abdullah II park.',
        ar: 'يدير برنامج أمانة عمّان الكبرى للمشي المجتمعي الآن جولات مشي صباحية مجانية بمرافقة مرشدين في ثماني من حدائق الأحياء، من حديقة الحسين إلى حديقة الملك عبد الله الثاني.',
      },
      {
        en: 'Organizers say the social routine is the point: people keep coming for the company, and the fitness follows.',
        ar: 'يقول المنظمون إن الروتين الاجتماعي هو الجوهر: الناس يعودون من أجل الرفقة، وتأتي اللياقة تبعًا لذلك.',
      },
      {
        en: 'Public-health researchers note that group walking is among the best-evidenced low-cost interventions for mild low mood and isolation.',
        ar: 'يلاحظ باحثو الصحة العامة أن المشي الجماعي من أفضل التدخلات منخفضة التكلفة المدعومة بالأدلة في علاج الكآبة الخفيفة والعزلة.',
      },
    ],
    source: { name: { en: 'Greater Amman Municipality programs', ar: 'برامج أمانة عمّان الكبرى' }, url: '#' },
    publishedAt: '2025-04-20',
    readMins: 3,
    disclaimer: true,
  },
]
