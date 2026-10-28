export type PageId =
  | 'home'
  | 'prayers'
  | 'quran'
  | 'khatma'
  | 'azkar'
  | 'tasbih'
  | 'zakat'
  | 'faq'
  | 'library'
  | 'recipes'
  | 'suhoor'
  | 'health-tips'
  | 'habits'
  | 'ehsan'
  | 'series'
  | 'kids'
  | 'designers';

export interface HabitItem {
  id: number;
  name: string;
  type: 'good' | 'bad';
  startTime: number;
  relapses: number;
  quote: string;
}

export interface KhatmaDay {
  part: string;
  surah: string;
  verse: string;
}

export interface KhatmaState {
  targetKhatmas: number;
  days: KhatmaDay[];
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean | object;
  }[];
}
