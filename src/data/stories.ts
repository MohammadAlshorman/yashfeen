import type { Story } from './types'

/** 4 sample Stories (stories.md §Sample stories) — EN/AR paired, `_sample: true`. */
export const stories: Story[] = [
  {
    _sample: true,
    id: 'story-01',
    author: { en: 'Rania K.', ar: 'رانيا ك.' },
    city: { en: 'Amman', ar: 'عمّان' },
    title: { en: 'The water held me up', ar: 'حملني الماء' },
    quote: {
      en: 'For the first time in a year, something else was doing the holding.',
      ar: 'لأول مرة منذ عام، كان شيءٌ آخر هو من يُمسك بي.',
    },
    excerpt: {
      en: 'After a burnout year, my first float at the Dead Sea at 7am — the silence of the shore, the impossible buoyancy, and a nervous system that finally believed it could stop.',
      ar: 'بعد عام من الاحتراق الوظيفي، أول طفوٍ لي في البحر الميت عند السابعة صباحًا — صمت الشاطئ، وطفوٌ يكاد يكون مستحيلًا، وجهازٌ عصبي صدّق أخيرًا أنه يستطيع التوقف.',
    },
    body: [
      {
        en: 'I arrived before the tour buses, when the shore is still salt-white and empty and the water looks hammered flat, like pewter.',
        ar: 'وصلت قبل حافلات السياح، حين يكون الشاطئ ما يزال أبيض مالحًا وفارغًا، والماء منبسطًا كأنه معدن مطروق.',
      },
      {
        en: 'A year of fourteen-hour days had taught my shoulders to live near my ears. I walked in up to my knees and sat back the way everyone says you should.',
        ar: 'عامٌ من أيام عمل بأربع عشرة ساعة علّم كتفيّ أن يسكنا قرب أذنيّ. دخلت حتى ركبتيّ وجلست إلى الخلف كما ينصح الجميع.',
      },
      {
        en: 'The water simply declined to let me sink. I laughed — actually laughed — alone on a beach at seven in the morning.',
        ar: 'رفض الماء ببساطة أن يدعني أغرق. ضحكت — ضحكت فعلًا — وحدي على شاطئ عند السابعة صباحًا.',
      },
      {
        en: 'For the first time in a year, something else was doing the holding. I floated and watched the hills of the far shore turn pink, and I did not think about my inbox once.',
        ar: 'لأول مرة منذ عام، كان شيءٌ آخر هو من يُمسك بي. طفوت أراقب تلال الضفة البعيدة وهي تكتسي بالوردي، ولم أفكر في بريدي الوارد ولا مرة.',
      },
      {
        en: 'I still go back once a month. Not for the minerals, or not only for them. For the memory that my body can be held without effort.',
        ar: 'ما زلت أعود مرة كل شهر. ليس من أجل المعادن، أو ليس من أجلها فقط. بل لذكرى أن جسدي يمكن أن يُحمَل دون جهد.',
      },
    ],
    destination: 'dead-sea',
    destinationLabel: { en: 'Dead Sea', ar: 'البحر الميت' },
    moodTag: 'calm',
  },
  {
    _sample: true,
    id: 'story-02',
    author: { en: 'Omar S.', ar: 'عمر س.' },
    city: { en: 'Irbid', ar: 'إربد' },
    title: { en: 'I walked until my thoughts got quiet', ar: 'مشيتُ حتى هدأت أفكاري' },
    quote: {
      en: 'The desert does not answer you. After a day or two, you stop asking.',
      ar: 'الصحراء لا تجيبك. وبعد يوم أو يومين، تكفّ عن السؤال.',
    },
    excerpt: {
      en: 'Three days in the Valley of the Moon with a Bedouin guide — walking until the noise in my head matched the silence outside it.',
      ar: 'ثلاثة أيام في وادي القمر مع دليل بدوي — أمشي حتى تطابق ضجيج رأسي الصمتَ في الخارج.',
    },
    body: [
      {
        en: 'I went to Wadi Rum because a friend said: you don’t need to talk there. He was right, but not for the reason I expected.',
        ar: 'ذهبت إلى وادي رم لأن صديقًا قال لي: لن تحتاج إلى الكلام هناك. كان محقًا، لكن ليس للسبب الذي توقعته.',
      },
      {
        en: 'My guide, Salem, walked half a step ahead and spoke maybe twenty words a day. The first day my thoughts were deafening. The second day they were merely loud.',
        ar: 'كان دليلي سالم يمشي نصف خطوة أمامي ولا ينطق أكثر من عشرين كلمة في اليوم. في اليوم الأول كانت أفكاري صاخبة تُصمّ الآذان. وفي اليوم الثاني كانت عالية فحسب.',
      },
      {
        en: 'On the third day, somewhere between a red dune and a rock bridge, I noticed I had been walking for an hour without narrating anything to myself.',
        ar: 'في اليوم الثالث، في مكان ما بين كثيب أحمر وجسر صخري، لاحظت أنني مشيت ساعة كاملة دون أن أروي لنفسي أي شيء.',
      },
      {
        en: 'The desert does not answer you. After a day or two, you stop asking. That, I think, is the whole therapy.',
        ar: 'الصحراء لا تجيبك. وبعد يوم أو يومين، تكفّ عن السؤال. هذا، على ما أظن، هو العلاج كله.',
      },
      {
        en: 'I came home to Irbid and kept one habit: an hour’s walk every Friday, no phone. My thoughts still get loud. Now I know they get quiet too.',
        ar: 'عدت إلى إربد وأبقيت عادة واحدة: ساعة مشي كل جمعة، بلا هاتف. أفكاري ما تزال تصخب أحيانًا. لكنني أعرف الآن أنها تهدأ أيضًا.',
      },
    ],
    destination: 'wadi-rum',
    destinationLabel: { en: 'Wadi Rum', ar: 'وادي رم' },
    moodTag: 'tired',
  },
  {
    _sample: true,
    id: 'story-03',
    author: { en: 'Layla H.', ar: 'ليلى ح.' },
    city: { en: 'Madaba', ar: 'مادبا' },
    title: { en: 'Steam, stone, and my grandmother’s stories', ar: 'بخارٌ وحجرٌ وقصص جدتي' },
    quote: {
      en: 'She told the same stories as always. In the steam, they were new again.',
      ar: 'روت القصص نفسها كما تفعل دائمًا. لكنها في البخار عادت جديدة.',
    },
    excerpt: {
      en: 'My grandmother took me to Ma’in when I was ten. Thirty years later, I took her — and the family tradition renewed itself in the warm water.',
      ar: 'أخذتني جدتي إلى حمامات ماعين وأنا في العاشرة. وبعد ثلاثين عامًا، أخذتها أنا — وجدّدت العادة العائلية نفسها في الماء الدافئ.',
    },
    body: [
      {
        en: 'When I was ten, my grandmother took me to Ma’in Hot Springs on the bus, with a bag of cucumbers and labaneh sandwiches.',
        ar: 'حين كنت في العاشرة، أخذتني جدتي إلى حمامات ماعين بالحافلة، مع كيس خيار وسندويشات لبنة.',
      },
      {
        en: 'This spring I drove her there myself. She is eighty-two now, and the mountain road made her quiet, but the steam made her young.',
        ar: 'هذا الربيع قدتُ بها إلى هناك بنفسي. هي في الثانية والثمانين الآن، وطريق الجبل أصمَتها، لكن البخار أعاد إليها صباها.',
      },
      {
        en: 'We sat in the warm pool with our feet on the smooth basalt, and she told the same stories as always — the wedding, the olive year, the uncle who swam the pool fully dressed. In the steam, they were new again.',
        ar: 'جلسنا في البركة الدافئة وأقدامنا على البازلت الأملس، وروت القصص نفسها كما تفعل دائمًا — العرس، وعام الزيتون، والعم الذي سبح بثيابه كاملة. لكنها في البخار عادت جديدة.',
      },
      {
        en: 'The mountain gives its warmth back to you. My grandmother says her mother told her that. Now I have told my daughter.',
        ar: 'الجبل يردّ إليك دفئه. تقول جدتي إن أمها أخبرتها ذلك. والآن أخبرتُ ابنتي.',
      },
    ],
    destination: 'main-hot-springs',
    destinationLabel: { en: 'Ma’in Hot Springs', ar: 'حمامات ماعين' },
    moodTag: 'joyful',
  },
  {
    _sample: true,
    id: 'story-04',
    author: { en: 'Yousef A.', ar: 'يوسف ع.' },
    city: { en: 'Aqaba', ar: 'العقبة' },
    title: { en: 'Dawn over the Treasury', ar: 'فجرٌ فوق الخزنة' },
    quote: {
      en: 'The facade turned from grey to rose to fire, and something in me turned with it.',
      ar: 'تحوّلت الواجهة من الرمادي إلى الوردي إلى اللهب، وتحوّل معها شيءٌ في داخلي.',
    },
    excerpt: {
      en: 'A 5am walk through the Siq in a difficult season — and the sunrise over the Treasury that reset more than a morning.',
      ar: 'مشية الخامسة فجرًا عبر السيق في موسمٍ صعب — وشروقٌ فوق الخزنة أعاد ضبط أكثر من مجرد صباح.',
    },
    body: [
      {
        en: 'Everyone photographs the Treasury at noon. The secret is to be at the gate at five, when the guards are still drinking tea and the Siq is yours alone.',
        ar: 'الجميع يصوّر الخزنة ظهرًا. السر أن تكون عند البوابة في الخامسة، حين يكون الحراس ما يزالون يشربون الشاي ويكون السيق لك وحدك.',
      },
      {
        en: 'I was in a difficult season — work gone wrong, sleep gone worse. I walked the canyon in the dark, one hand on the cool stone.',
        ar: 'كنت أمر بموسم صعب — عمل تعثّر، ونوم ساء أكثر. مشيت في الشق الجبلي في العتمة ويدي على الحجر البارد.',
      },
      {
        en: 'Then the passage opened, and the sun hit the top of the facade first. The facade turned from grey to rose to fire, and something in me turned with it.',
        ar: 'ثم انفتح الممر، وضربت الشمس قمة الواجهة أولًا. تحوّلت الواجهة من الرمادي إلى الوردي إلى اللهب، وتحوّل معها شيءٌ في داخلي.',
      },
      {
        en: 'A city carved by water and time does not hurry, and it is still standing. I walked back out slowly. The season did not end that day, but my footing returned.',
        ar: 'مدينة نحتها الماء والزمن لا تستعجل، وما تزال قائمة. مشيت خارجًا ببطء. لم ينتهِ الموسم الصعب في ذلك اليوم، لكن ثباتي عاد إليّ.',
      },
    ],
    destination: 'petra',
    destinationLabel: { en: 'Petra', ar: 'البتراء' },
    moodTag: 'energized',
  },
]
