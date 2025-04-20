import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import WordCard from '../../components/WordCard';
import { useWordStore } from '../../stores/wordStore';

export default function Index() {
  const {
    allWords,
    setAllWords,
    addKnownWord,
    addUnknownWord,
  } = useWordStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setAllWords([
      { id: 1, word: 'apple', translation: 'elma' },
      { id: 2, word: 'house', translation: 'ev' },
      { id: 3, word: 'car', translation: 'araba' },
    ]);
  }, []);

  const currentWord = allWords[currentIndex];

  const handleSwipeRight = () => {
    if (!currentWord) return;
    addKnownWord(currentWord);
    goToNextWord();
  };

  const handleSwipeLeft = () => {
    if (!currentWord) return;
    addUnknownWord(currentWord);
    goToNextWord();
  };

  const goToNextWord = () => {
    if (currentIndex < allWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Tüm kelimeler bittiğinde uyarı ve yazıyı göster
      Alert.alert('Bitti!', 'Tüm kelimeleri tamamladınız.');
      setCurrentIndex(allWords.length); // Bu da sonrasında boş bir state sağlar.
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kelime Ezberleme</Text>
        <Text style={styles.progress}>
          {Math.min(currentIndex + 1, allWords.length)} / {allWords.length}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {currentIndex < allWords.length ? (
          <WordCard
            word={currentWord.word}
            translation={currentWord.translation}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
          />
        ) : (
          <Text style={styles.title}>🎉 Tebrikler, kelimeleri bitirdiniz!</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20, marginTop: 40,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  progress: { fontSize: 18, color: '#666' },
  cardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
