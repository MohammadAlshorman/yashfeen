import type { Service } from './types'

/** 4 sample Services (lab / imaging / physio / home-care) — EN/AR paired, `_sample: true`. */
export const services: Service[] = [
  {
    _sample: true,
    id: 'svc-01',
    name: { en: 'At-home lab draws', ar: 'سحب العينات المخبرية في المنزل' },
    type: 'lab',
    city: { en: 'Amman', ar: 'عمّان' },
    priceFrom: 15,
    provider: { en: 'Biolab Jordan — home visit team', ar: 'بيولاب الأردن — فريق الزيارات المنزلية' },
    source: { name: { en: 'Provider service listing', ar: 'صفحة الخدمة لدى المزوِّد' }, url: '#' },
  },
  {
    _sample: true,
    id: 'svc-02',
    name: { en: 'MRI & CT imaging center', ar: 'مركز تصوير بالرنين المغناطيسي والطبقي' },
    type: 'imaging',
    city: { en: 'Irbid', ar: 'إربد' },
    priceFrom: 80,
    provider: { en: 'Irbid Diagnostic Imaging', ar: 'إربد للتصوير التشخيصي' },
    source: { name: { en: 'Provider service listing', ar: 'صفحة الخدمة لدى المزوِّد' }, url: '#' },
  },
  {
    _sample: true,
    id: 'svc-03',
    name: { en: 'Sports physiotherapy clinic', ar: 'عيادة علاج طبيعي رياضي' },
    type: 'physio',
    city: { en: 'Amman', ar: 'عمّان' },
    priceFrom: 25,
    provider: { en: 'MoveWell Physio, Abdoun', ar: 'موف ويل للعلاج الطبيعي، عبدون' },
    source: { name: { en: 'Provider service listing', ar: 'صفحة الخدمة لدى المزوِّد' }, url: '#' },
  },
  {
    _sample: true,
    id: 'svc-04',
    name: { en: 'Home nursing visits', ar: 'زيارات تمريض منزلي' },
    type: 'home-care',
    city: { en: 'Zarqa', ar: 'الزرقاء' },
    priceFrom: 20,
    provider: { en: 'Dar Al-Shifa Home Care', ar: 'دار الشفاء للرعاية المنزلية' },
    source: { name: { en: 'Provider service listing', ar: 'صفحة الخدمة لدى المزوِّد' }, url: '#' },
  },
]
