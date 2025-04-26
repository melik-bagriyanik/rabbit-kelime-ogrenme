import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import wordsData from '../app/(tabs)/words.json';

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
  loadStoredWords: () => void;
}

const initialWords: Word[] = wordsData.map((word) => ({
  id: word.id,
  word: word.word,
  translation: word.translation,
}));

export const useWordStore = create<WordState>((set) => ({
  allWords: initialWords,
  knownWords: [],
  unknownWords: [],

  setAllWords: (words) => set({ allWords: words }),

  addKnownWord: async (word) => {
    set((state) => {
      if (state.knownWords.some(w => w.id === word.id)) {
        return state;
      }
      const updatedKnownWords = [...state.knownWords, word];
      const updatedAllWords = state.allWords.filter(w => w.id !== word.id);
      AsyncStorage.setItem('knownWords', JSON.stringify(updatedKnownWords));
      AsyncStorage.setItem('allWords', JSON.stringify(updatedAllWords));
      return { 
        knownWords: updatedKnownWords,
        allWords: updatedAllWords
      };
    });
  },

  addUnknownWord: async (word) => {
    set((state) => {
      const updatedUnknownWords = [...state.unknownWords, word];
      const updatedAllWords = state.allWords.filter(w => w.id !== word.id);
      AsyncStorage.setItem('unknownWords', JSON.stringify(updatedUnknownWords));
      AsyncStorage.setItem('allWords', JSON.stringify(updatedAllWords));
      return { 
        unknownWords: updatedUnknownWords,
        allWords: updatedAllWords
      };
    });
  },

  removeUnknownWord: (wordId) =>
    set((state) => {
      const updatedUnknownWords = state.unknownWords.filter((word) => word.id !== wordId);
      AsyncStorage.setItem('unknownWords', JSON.stringify(updatedUnknownWords));
      return { unknownWords: updatedUnknownWords };
    }),

  resetWords: () => {
    AsyncStorage.removeItem('knownWords');
    AsyncStorage.removeItem('unknownWords');
    AsyncStorage.removeItem('allWords');
    set({ knownWords: [], unknownWords: [], allWords: initialWords });
  },

  loadStoredWords: async () => {
    try {
      const known = await AsyncStorage.getItem('knownWords');
      const unknown = await AsyncStorage.getItem('unknownWords');
      const all = await AsyncStorage.getItem('allWords');
      
      // Tekrar eden ID'leri önlemek için Set kullanıyoruz
      const knownWordsSet = new Set();
      const unknownWordsSet = new Set();
      
      const parsedKnown = known ? JSON.parse(known) : [];
      const parsedUnknown = unknown ? JSON.parse(unknown) : [];
      
      // Tekrar eden ID'leri filtrele
      const filteredKnown = parsedKnown.filter((word: Word) => {
        if (knownWordsSet.has(word.id)) {
          return false;
        }
        knownWordsSet.add(word.id);
        return true;
      });
      
      const filteredUnknown = parsedUnknown.filter((word: Word) => {
        if (unknownWordsSet.has(word.id)) {
          return false;
        }
        unknownWordsSet.add(word.id);
        return true;
      });
      
      // Create a set of IDs that are already in known or unknown lists
      const usedIds = new Set([
        ...filteredKnown.map((word: Word) => word.id),
        ...filteredUnknown.map((word: Word) => word.id)
      ]);
      
      // Filter out words that are already in known or unknown lists
      const filteredAllWords = initialWords.filter((word: Word) => !usedIds.has(word.id));
      
      set({
        knownWords: filteredKnown,
        unknownWords: filteredUnknown,
        allWords: filteredAllWords,
      });
    } catch (e) {
      console.error("Veri yüklenirken hata oluştu:", e);
      // Hata durumunda başlangıç kelimelerini kullan
      set({
        knownWords: [],
        unknownWords: [],
        allWords: initialWords,
      });
    }
  },
}));
