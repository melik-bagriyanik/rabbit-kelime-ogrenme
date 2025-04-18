import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import WordCard from '../../components/WordCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Word {
  id: number;
  word: string;
  translation: string;
}

const initialWords: Word[] = [
  { id: 1, word: 'Hello', translation: 'Merhaba' },
  { id: 2, word: 'Goodbye', translation: 'Hoşçakal' },
  { id: 3, word: 'Thank you', translation: 'Teşekkür ederim' },
  { id: 4, word: 'Please', translation: 'Lütfen' },
  { id: 5, word: 'Sorry', translation: 'Özür dilerim' },
];

export default function Index() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownWords, setKnownWords] = useState<Word[]>([]);
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);

  // Başlangıçta kelimeleri yükle
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Başlangıç kelimelerini yükle
        setWords(initialWords);

        // AsyncStorage'dan kaydedilmiş kelimeleri yükle
        const storedReviewWords = await AsyncStorage.getItem('reviewWords');
        if (storedReviewWords) {
          const parsedReviewWords = JSON.parse(storedReviewWords);
          setReviewWords(parsedReviewWords);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  const handleSwipeLeft = async () => {
    try {
      setLoading(true);
      const currentWord = words[currentIndex];
      
      // Mevcut reviewWords'ü koru ve yeni kelimeyi ekle
      const newReviewWords = [...reviewWords, { ...currentWord }];
      console.log('New Review Words:', newReviewWords);
      await AsyncStorage.setItem('reviewWords', JSON.stringify(newReviewWords));
      setReviewWords(newReviewWords);

      // Sonraki kelimeye geç
      await moveToNextWord();
    } catch (error) {
      console.error('Error in handleSwipeLeft:', error);
      setLoading(false);
    }
  };

  const handleSwipeRight = async () => {
    try {
      setLoading(true);
      const currentWord = words[currentIndex];
      const newKnownWords = [...knownWords, currentWord];
      await AsyncStorage.setItem('knownWords', JSON.stringify(newKnownWords));
      setKnownWords(newKnownWords);
      await moveToNextWord();
    } catch (error) {
      console.error('Error in handleSwipeRight:', error);
      setLoading(false);
    }
  };

  const moveToNextWord = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
          setCurrentIndex(0);
        }
        setLoading(false);
        resolve();
      }, 500);
    });
  };

  const handleRestart = async () => {
    try {
      setCurrentIndex(0);
      setKnownWords([]);
      setReviewWords([]);
      await AsyncStorage.removeItem('knownWords');
      await AsyncStorage.removeItem('reviewWords');
    } catch (error) {
      console.error('Error restarting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kelime Ezberleme</Text>
        <Text style={styles.progress}>
          {currentIndex + 1}/{words.length}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {words.length > 0 ? (
          <WordCard
            word={words[currentIndex].word}
            translation={words[currentIndex].translation}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            loading={loading}
          />
        ) : (
          <Text>No words available</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Bildiğiniz Kelimeler: {knownWords.length}
        </Text>
        <Text style={styles.statsText}>
          Tekrar Edilecek Kelimeler: {reviewWords.length}
        </Text>
        <TouchableOpacity
          style={styles.restartButton}
          onPress={handleRestart}
        >
          <Text style={styles.restartButtonText}>Yeniden Başla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progress: {
    fontSize: 18,
    color: '#666',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  restartButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 