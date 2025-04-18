import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import WordCard from '../../components/WordCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Word {
  id: number;
  word: string;
  translation: string;
}

export default function Review() {
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Başlangıçta tekrar edilecek kelimeleri yükle
  useEffect(() => {
    const loadReviewWords = async () => {
      try {
        const storedReviewWords = await AsyncStorage.getItem('reviewWords');
        console.log('Stored Review Words:', storedReviewWords);
        if (storedReviewWords) {
          const words = JSON.parse(storedReviewWords);
          console.log('Parsed Review Words:', words);
          // Kelimeleri ID'lerine göre sırala
          const sortedWords = words.sort((a: Word, b: Word) => a.id - b.id);
          setReviewWords(sortedWords);
        }
      } catch (error) {
        console.error('Error loading review words:', error);
      }
    };

    // İlk yükleme
    loadReviewWords();

    // Her 1 saniyede bir kontrol et
    const interval = setInterval(loadReviewWords, 1000);

    // Temizleme
    return () => clearInterval(interval);
  }, []);

  // Sonraki kelimeye geç
  const moveToNextWord = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (reviewWords.length === 0) {
          setLoading(false);
          resolve();
          return;
        }

        if (currentIndex < reviewWords.length - 1) {
          setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
          setCurrentIndex(0);
        }
        setLoading(false);
        resolve();
      }, 500);
    });
  };

  // Sağa kaydırma (bildiğim kelimeler)
  const handleSwipeRight = async () => {
    try {
      if (reviewWords.length === 0) return;

      setLoading(true);
      const currentWord = reviewWords[currentIndex];
      
      // Kelimeyi reviewWords listesinden çıkar
      const newReviewWords = reviewWords.filter((word) => word.id !== currentWord.id);
      await AsyncStorage.setItem('reviewWords', JSON.stringify(newReviewWords));
      setReviewWords(newReviewWords);

      // Sonraki kelimeye geç
      await moveToNextWord();
    } catch (error) {
      console.error('Error in handleSwipeRight:', error);
      setLoading(false);
    }
  };

  // Sola kaydırma (tekrar edilecek kelimeler)
  const handleSwipeLeft = async () => {
    try {
      if (reviewWords.length === 0) return;

      setLoading(true);
      const currentWord = reviewWords[currentIndex];
      
      // Kelimeyi dizinin sonuna taşı
      const newReviewWords = [
        ...reviewWords.filter((word) => word.id !== currentWord.id),
        currentWord
      ];
      await AsyncStorage.setItem('reviewWords', JSON.stringify(newReviewWords));
      setReviewWords(newReviewWords);

      // Sonraki kelimeye geç
      await moveToNextWord();
    } catch (error) {
      console.error('Error in handleSwipeLeft:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tekrar</Text>
        <Text style={styles.progress}>
          {reviewWords.length > 0 ? `${currentIndex + 1}/${reviewWords.length}` : '0/0'}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {reviewWords.length > 0 ? (
          <WordCard
            word={reviewWords[currentIndex].word}
            translation={reviewWords[currentIndex].translation}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            loading={loading}
          />
        ) : (
          <Text style={styles.emptyText}>Tekrar edilecek kelime yok</Text>
        )}
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
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
}); 