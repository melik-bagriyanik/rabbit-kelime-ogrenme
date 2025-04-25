import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  loadStoredWords: () => void; // Yeni fonksiyon
}

export const useWordStore = create<WordState>((set) => ({
  allWords: [],
  knownWords: [],
  unknownWords: [],

  setAllWords: (words) => set({ allWords: words }),

  addKnownWord: async (word) => {
    set((state) => {
      if (state.knownWords.some(w => w.id === word.id)) {
        return state;
      }
      const updated = [...state.knownWords, word];
      AsyncStorage.setItem('knownWords', JSON.stringify(updated));
      return { knownWords: updated };
    });
  },

  addUnknownWord: async (word) => {
    set((state) => {
      const updated = [...state.unknownWords, word];
      AsyncStorage.setItem('unknownWords', JSON.stringify(updated));
      return { unknownWords: updated };
    });
  },

  removeUnknownWord: (wordId) =>
    set((state) => {
      const updated = state.unknownWords.filter((word) => word.id !== wordId);
      AsyncStorage.setItem('unknownWords', JSON.stringify(updated));
      return { unknownWords: updated };
    }),

  resetWords: () => {
    AsyncStorage.removeItem('knownWords');
    AsyncStorage.removeItem('unknownWords');
    set({ knownWords: [], unknownWords: [] });
  },

  loadStoredWords: async () => {
    try {
      const known = await AsyncStorage.getItem('knownWords');
      const unknown = await AsyncStorage.getItem('unknownWords');
      
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
      
      set({
        knownWords: filteredKnown,
        unknownWords: filteredUnknown,
      });
    } catch (e) {
      console.error("Veri yüklenirken hata oluştu:", e);
    }
  },
}));
