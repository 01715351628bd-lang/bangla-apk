import {
  unicodeToBijoy as libUnicodeToBijoy,
  bijoyToUnicode as libBijoyToUnicode,
  isUnicode as libIsUnicode,
} from '@abdalgolabs/ansi-unicode-converter';
import { SampleText, TextStats } from '../types/converter';

/**
 * Converts Unicode Bengali text to Bijoy (SutonnyMJ) text using @abdalgolabs/ansi-unicode-converter
 */
export function unicodeToBijoy(input: string): string {
  if (!input) return '';
  try {
    return libUnicodeToBijoy(input);
  } catch (error) {
    console.error('Unicode to Bijoy conversion error:', error);
    return input;
  }
}

/**
 * Converts Bijoy (SutonnyMJ / ANSI) text to Unicode Bengali text using @abdalgolabs/ansi-unicode-converter
 */
export function bijoyToUnicode(input: string): string {
  if (!input) return '';
  try {
    return libBijoyToUnicode(input);
  } catch (error) {
    console.error('Bijoy to Unicode conversion error:', error);
    return input;
  }
}

/**
 * Detects whether the provided string contains Unicode Bangla characters
 */
export function isUnicodeText(input: string): boolean {
  if (!input) return false;
  return libIsUnicode(input);
}

/**
 * Calculates scannable text statistics: character count, word count, line count
 */
export function calculateStats(text: string): TextStats {
  if (!text) {
    return { chars: 0, charsWithoutSpaces: 0, words: 0, lines: 0 };
  }

  const chars = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const lines = text.split(/\r\n|\r|\n/).length;

  const wordsMatch = text.trim().match(/[\S]+/g);
  const words = wordsMatch ? wordsMatch.length : 0;

  return { chars, charsWithoutSpaces, words, lines };
}

/**
 * Curated Bengali sample texts for instant verification
 */
export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: 'anthem',
    title: 'জাতীয় সংগীত (National Anthem)',
    category: 'সাহিত্য',
    unicodeText:
      'আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।\nচিরদিন তোমার আকাশ, তোমার বাতাস, আমার প্রাণে বাজায় বাঁশি॥\n\nও মা, ফাগুনে তোর আমের বনে ঘ্রাণে পাগল করে,\nমরি হায়, হায় রে—\nও মা, অঘ্রানে তোর ভরা ক্ষেতে আমি কী দেখেছি মধুর হাসি॥',
    description: 'রবীন্দ্রনাথ ঠাকুরের কালজয়ী জাতীয় সংগীত'
  },
  {
    id: 'bidrohi',
    title: 'বিদ্রোহী কবিতা (Rebel Poet)',
    category: 'কবিতা',
    unicodeText:
      'বল বীর—\nবল উন্নত মম শির!\nশির নেহারি আমারি নতশির ওই শিখর হিমাদ্রির!\nবল বীর—\nবল মহাবিশ্বের মহাকাশ ফাড়ি’\nচন্দ্র সূর্য গ্রহ তারা ছাড়ি’\nভূলোক দ্যুলোক গোলক ভেদিয়া\nখোদার আসন ‘আরশ’ ছেদিয়া,\nউঠিয়াছি চির-বিস্ময় আমি বিশ্ববিধাতৃর!',
    description: 'কাজী নজরুল ইসলামের অগ্নিবীণা কাব্যগ্রন্থের অমর কবিতা'
  },
  {
    id: 'conjuncts',
    title: 'যুক্তাক্ষর ও বিশেষ বর্ণ (Complex Conjuncts)',
    category: 'ভেরিফিকেশন',
    unicodeText:
      'যুক্তবর্ণ পরীক্ষা:\nবিজ্ঞান, প্রযুক্তি, আন্তর্জাতিক, কৌতূহল, ব্রাহ্মণবাড়িয়া, পরীক্ষা, সৃষ্টি, বৃষ্টি, স্বাধীনতা, সার্বভৌমত্ব, উজ্জ্বল, বন্দ্যোপাধ্যায়, হৃৎপিণ্ড, শঙ্খনাদ, শৃঙ্খলা, শতাব্দী, আশ্চর্য, উন্মুক্ত, কণ্টকাকীর্ণ।\n\nসংখ্যা ও বিরামচিহ্ন:\n১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯, ০ — মূল্য: ৳১২৫০.৫০ টাকা।',
    description: 'ক্ষ, জ্ঞ, ষ্ণ, হ্ম, ণ্ড, ঞ্চ, ত্র, ঙ্গ ইত্যাদি জটিল যুক্তবর্ণের সঠিক রূপান্তর যাচাই'
  },
  {
    id: 'notice',
    title: 'দাপ্তরিক বিজ্ঞপ্তি (Official Notice)',
    category: 'অফিসিয়াল',
    unicodeText:
      'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার\nতথ্য ও যোগাযোগ প্রযুক্তি বিভাগ\n\nবিষয়: সর্বস্তরে বাংলা ভাষার সঠিক প্রয়োগ ও তথ্যপ্রযুক্তি রূপান্তর সংক্রান্ত নির্দেশিকা।\n\nএতদ্বারা সংশ্লিষ্ট সকলের অবগতির জন্য জানানো যাচ্ছে যে, সমস্ত সরকারি নথিপত্র ও প্রকাশনায় ইউনিকোড থেকে বিজয় (সুতোন্মীএমজে) ফন্টে রূপান্তরের ক্ষেত্রে সতর্কতার সাথে প্রুফ রিডিং সম্পন্ন করতে হবে।',
    description: 'সরকারি বিজ্ঞপ্তি ও সংবাদপত্র মুদ্রণের উপযোগী ফরম্যাট'
  }
];
