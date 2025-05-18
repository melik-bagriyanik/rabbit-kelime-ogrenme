import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useThemeStore } from '../stores/themeStore';
import { useWordStore } from '../stores/wordStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function RepeatTest() {
  const { colors, mode } = useThemeStore();
  const { unknownWords } = useWordStore();
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (unknownWords.length > 0) {
      generateQuestion();
    }
  }, [unknownWords]);

  const generateQuestion = () => {
    // Rastgele bir kelime seç
    const qIndex = getRandomInt(unknownWords.length);
    const q = unknownWords[qIndex];
    // 3 yanlış şık seç
    let wrongs = unknownWords.filter((w, i) => i !== qIndex);
    wrongs = wrongs.sort(() => 0.5 - Math.random()).slice(0, 3);
    // Şıkları karıştır
    const allOptions = [...wrongs.map(w => w.translation), q.translation].sort(() => 0.5 - Math.random());
    setQuestion(q);
    setOptions(allOptions);
    setSelected(null);
    setShowAnswer(false);
  };

  const handleSelect = (option: string, idx: number) => {
    setSelected(idx);
    setShowAnswer(true);
    if (option === question.translation) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      generateQuestion();
    }, 1000);
  };

  if (!unknownWords.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text.primary, fontSize: 20 }}>Tekrar edilmesi gereken kelime yok!</Text>
      </View>
    );
  }

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
        <TouchableOpacity onPress={() => router.back()} style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
          <Ionicons name="arrow-back" size={28} color={colors.text.white} />
        </TouchableOpacity>
        <Text style={[styles.score, { color: colors.text.white }]}>Puan: {score}</Text>
        {question && (
          <>
            <Text style={[styles.question, { color: colors.text.white }]}>"{question.word}" kelimesinin Türkçesi nedir?</Text>
            <View style={styles.optionsContainer}>
              {options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.option,
                    selected === idx && (option === question.translation
                      ? { backgroundColor: colors.primary }
                      : { backgroundColor: colors.danger }),
                  ]}
                  onPress={() => !showAnswer && handleSelect(option, idx)}
                  disabled={showAnswer}
                >
                  <Text style={[styles.optionText, { color: colors.text.white }]}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
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
    alignItems: 'center',
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  option: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#ffffff30',
    marginBottom: 16,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 