import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

interface Props {
  word: string;
  translation: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

export default function WordCard({ word, translation, onSwipeRight, onSwipeLeft }: Props) {
  const translateX = new Animated.Value(0);  // Animasyonun yatay kayma değeri

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }  // Performansı artırmak için native driver kullanıyoruz
  );

  const handleEnd = (e: any) => {
    const dx = e.nativeEvent.translationX;  // Kaydırma mesafesi

    // Sağ kaydırma
    if (dx > 100) {
      Animated.spring(translateX, {
        toValue: 500,  // Sağ tarafa doğru kaydırıyoruz
        useNativeDriver: true,
      }).start(() => onSwipeRight());  // Animasyon bittiğinde swipe sağ işlemi

    // Sol kaydırma
    } else if (dx < -100) {
      Animated.spring(translateX, {
        toValue: -500,  // Sol tarafa doğru kaydırıyoruz
        useNativeDriver: true,
      }).start(() => onSwipeLeft());  // Animasyon bittiğinde swipe sol işlemi

    // Eğer çok kaydırılmadıysa, kartı eski yerine geri getir
    } else {
      Animated.spring(translateX, {
        toValue: 0,  // Yatay kaymayı sıfırlıyoruz
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <GestureHandlerRootView>
    <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleEnd}>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX }] },  // Animasyona göre yatay kaydırma
        ]}
      >
        <Text style={styles.word}>{word}</Text>
        <Text style={styles.translation}>{translation}</Text>
      </Animated.View>
      
    </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  word: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 20,
    color: 'gray',
    marginTop: 10,
  },
});
