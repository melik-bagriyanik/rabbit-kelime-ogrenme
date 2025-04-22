import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { useThemeStore } from '../stores/themeStore';

interface Props {
  word: string;
  translation?: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

export default function WordCard({ word, translation, onSwipeRight, onSwipeLeft }: Props) {
  const colors = useThemeStore((state) => state.colors);
  const translateX = new Animated.Value(0);

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleEnd = (e: any) => {
    const dx = e.nativeEvent.translationX;

    if (dx > 100) {
      Animated.spring(translateX, {
        toValue: 500,
        useNativeDriver: true,
      }).start(() => onSwipeRight());

    } else if (dx < -100) {
      Animated.spring(translateX, {
        toValue: -500,
        useNativeDriver: true,
      }).start(() => onSwipeLeft());

    } else {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const cardStyle = {
    ...styles.card,
    backgroundColor: colors.card,
    shadowColor: colors.shadow.color,
    shadowOpacity: colors.shadow.opacity,
  };

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleEnd}>
        <Animated.View
          style={[
            cardStyle,
            { transform: [{ translateX }] },
          ]}
        >
          <Text style={[styles.word, { color: colors.text.primary }]}>{word}</Text>
          <Text style={[styles.translation, { color: colors.text.secondary }]}>{translation}</Text>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 200,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
   marginTop: 150,
  },
  word: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 20,
    marginTop: 10,
  },
});
