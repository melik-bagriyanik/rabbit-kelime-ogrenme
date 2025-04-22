import { create } from 'zustand';

interface Word {
  id: number;
  word: string;
  translation?: string;
}

interface WordState {
  allWords: Word[];
  knownWords: Word[];
  unknownWords: Word[];
  setAllWords: (words: Word[]) => void;
  addKnownWord: (word: Word) => void;
  addUnknownWord: (word: Word) => void;
  removeUnknownWord: (wordId: number) => void;
  resetWords: () => void;
}

export const useWordStore = create<WordState>((set) => ({
  allWords: [],
  knownWords: [],
  unknownWords: [],
  setAllWords: (words) => set({ allWords: words }),
  addKnownWord: (word) =>
    set((state) => ({
      knownWords: [...state.knownWords, word],
    })),
  addUnknownWord: (word) =>
    set((state) => ({
      unknownWords: [...state.unknownWords, word],
    })),
  removeUnknownWord: (wordId) =>
    set((state) => ({
      unknownWords: state.unknownWords.filter((word) => word.id !== wordId),
    })),
  resetWords: () => set({ knownWords: [], unknownWords: [] }),
}));
