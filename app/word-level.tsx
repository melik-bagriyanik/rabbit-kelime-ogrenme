import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../stores/themeStore';
import { Ionicons } from '@expo/vector-icons';
import WordCard from '../components/WordCard';
import { useWordStore } from '../stores/wordStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import a1Words from "../app/(tabs)/a1.json";
import a2Words from "../app/(tabs)/a2.json";
import b1Words from "../app/(tabs)/b1.json";
import ydsWords from "../app/(tabs)/yds.json";

interface Word {
  id: number;
  word: string;
  translation: string;
}

const initialWordLevels = {
  yds: ydsWords,
  a1: a1Words,
  a2: a2Words,
  b1: b1Words,
};

export default function WordLevel() {
  const router = useRouter();
  const { level } = useLocalSearchParams();
  const { colors, mode } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCard, setShowCard] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [wordLevels, setWordLevels] = useState(initialWordLevels);
  const [loading, setLoading] = useState(false);

  const {
    addKnownWord,
    addUnknownWord,
  } = useWordStore();

  // Load saved word lists when component mounts
  useEffect(() => {
    const loadWordLists = async () => {
      try {
        const savedLevels = await AsyncStorage.getItem('wordLevels');
        if (savedLevels) {
          setWordLevels(JSON.parse(savedLevels));
        }
      } catch (error) {
        console.error('Error loading word lists:', error);
      }
    };
    loadWordLists();
  }, []);

  const currentWord = wordLevels[level as keyof typeof wordLevels]?.[currentIndex];

  useEffect(() => {
    if (currentWord) {
      fetchImageForWord(currentWord.word);
    }
  }, [currentWord]);

  const fetchImageForWord = async (query: string) => {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=49933608-7315ae5a43caa747f62db528e&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`
      );
      const data = await response.json();
      if (data.hits && data.hits.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.hits.length);
        const imageUrl = data.hits[randomIndex].webformatURL.replace('http://', 'https://');
        setImageUrl(imageUrl);
      } else {
        setImageUrl(null);
      }
    } catch (error) {
      console.error('Resim alınırken hata oluştu:', error);
      setImageUrl(null);
    }
  };

  const handleSwipeRight = () => {
    if (!currentWord) return;
    addKnownWord(currentWord);
    setShowCard(false);
    setTimeout(() => {
      goToNextWord();
      if (currentIndex < wordLevels[level as keyof typeof wordLevels].length - 1) {
        setShowCard(true);
      }
    }, 300);
  };

  const handleSwipeLeft = async () => {
    if (!currentWord) return;
    addUnknownWord(currentWord);

    // Remove the word from its original list
    const currentLevel = level as keyof typeof wordLevels;
    const updatedWords = wordLevels[currentLevel].filter(
      word => word.id !== currentWord.id
    );

    const newWordLevels = {
      ...wordLevels,
      [currentLevel]: updatedWords
    };

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('wordLevels', JSON.stringify(newWordLevels));
      setWordLevels(newWordLevels);

      // currentIndex'i güncelle: Eğer son kelimeyse bir önceki indexe çek
      setCurrentIndex(prev =>
        prev >= updatedWords.length ? Math.max(0, updatedWords.length - 1) : prev
      );
    } catch (error) {
      console.error('Error saving word lists:', error);
    }

    setShowCard(false);
    setTimeout(() => {
      setShowCard(true);
    }, 300);
  };

  const goToNextWord = () => {
    if (currentIndex < wordLevels[level as keyof typeof wordLevels].length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <LinearGradient
      colors={[colors.secondary, colors.danger]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Stack.Screen 
        options={{ 
          headerShown: false 
        }} 
      />
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.white} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text.white }]}>
            {level?.toString().toUpperCase()} Kelimeleri
          </Text>
          <Text style={[styles.progress, { color: colors.text.white }]}>
            {Math.min(currentIndex + 1, wordLevels[level as keyof typeof wordLevels]?.length || 0)} / {wordLevels[level as keyof typeof wordLevels]?.length || 0}
          </Text>
        </View>

        <View style={styles.cardContainer}>
          {currentIndex < (wordLevels[level as keyof typeof wordLevels]?.length || 0) ? (
            showCard ? (
              <>
                <WordCard
                  word={currentWord?.word}
                  translation={currentWord?.translation}
                  imageUrl={imageUrl ?? undefined}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                />
                <View style={styles.iconContainer}>
                  <View style={[styles.iconWrapper, { backgroundColor: `${colors.danger}20` }]}> 
                    <Ionicons name="close-circle" size={24} color={colors.text.white} />
                    <Text style={[styles.iconText, { color: colors.text.white }]}>Bilmiyorum</Text>
                  </View>
                  <View style={[styles.iconWrapper, { backgroundColor: `${colors.primary}20` }]}> 
                    <Ionicons name="checkmark-circle" size={24} color={colors.text.white} />
                    <Text style={[styles.iconText, { color: colors.text.white }]}>Biliyorum</Text>
                  </View>
                </View>
              </>
            ) : null
          ) : (
            <View style={styles.completedContainer}>
              <Text style={[styles.completedText, { color: colors.text.white }]}> 
                🎉 Tebrikler, kelimeleri bitirdiniz!
              </Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progress: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  iconText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
}); 