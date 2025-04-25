import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import WordCard from '../../components/WordCard';
import { useWordStore } from '../../stores/wordStore';
import { useThemeStore } from '../../stores/themeStore';
import wordsData from "./words.json"
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Word {
  id: number;
  word: string;
  translation: string;
}

const initialWords: Word[] = wordsData.map((word, index) => ({
  id: index,
  word: word.word,
  translation: word.translation,
}));

export default function Index() {
  const {
    allWords,
    setAllWords,
    addKnownWord,
    addUnknownWord,
  } = useWordStore();

  const { colors, mode, toggleTheme } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(true);

  useEffect(() => {
    setAllWords(initialWords);
  
    // AsyncStorage'dan bilinen/bilinmeyen kelimeleri yükle
    useWordStore.getState().loadStoredWords();
  
    setLoading(false);
  }, []);
  

  const currentWord = allWords[currentIndex];

  const handleSwipeRight = () => {
    if (!currentWord) return;
    addKnownWord(currentWord);
    setShowCard(false);
    setTimeout(() => {
      goToNextWord();
      if (currentIndex < allWords.length - 1) {
        setShowCard(true);
      }
    }, 300);
  };

  const handleSwipeLeft = () => {
    if (!currentWord) return;
    addUnknownWord(currentWord);
    setShowCard(false);
    setTimeout(() => {
      goToNextWord();
      if (currentIndex < allWords.length - 1) {
        setShowCard(true);
      }
    }, 300);
  };

  const goToNextWord = () => {
    if (currentIndex < allWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      Alert.alert('Bitti!', 'Tüm kelimeleri tamamladınız.');
      setCurrentIndex(allWords.length);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[colors.primary , colors.background]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ActivityIndicator size="large" color={colors.text.white} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.secondary, colors.danger]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.white }]}>Kelime Ezberleme</Text>
          <View style={styles.headerRight}>
            <Text style={[styles.progress, { color: colors.text.white }]}>
              {Math.min(currentIndex + 1, allWords.length)} / {allWords.length}
            </Text>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
              <Ionicons 
                name={mode === 'dark' ? 'sunny' : 'moon'} 
                size={24} 
                color={colors.text.white} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {currentIndex < allWords.length ? (
            showCard ? (
              <WordCard
                word={currentWord.word}
                translation={currentWord.translation}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
              />
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  progress: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 15,
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
});
