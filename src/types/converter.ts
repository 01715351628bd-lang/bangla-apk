export type ConversionMode = 'unicode-to-bijoy' | 'bijoy-to-unicode';

export interface TextStats {
  chars: number;
  charsWithoutSpaces: number;
  words: number;
  lines: number;
}

export interface SampleText {
  id: string;
  title: string;
  category: string;
  unicodeText: string;
  description: string;
}

export interface ConversionHistoryItem {
  id: string;
  timestamp: number;
  mode: ConversionMode;
  inputSnippet: string;
  outputSnippet: string;
  fullInput: string;
  fullOutput: string;
}
