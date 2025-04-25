import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { useThemeStore } from '../stores/themeStore';
import { Image } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  word: string;
  translation?: string;
  imageUrl?: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

export default function WordCard({ word, translation, onSwipeRight, onSwipeLeft,imageUrl }: Props) {
  const colors = useThemeStore((state) => state.colors);
  const translateX = new Animated.Value(0);

  // rotate değeri translateX'e bağlı
  const rotate = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-20deg', '0deg', '20deg'],
    extrapolate: 'clamp',
  });

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleEnd = (e: any) => {
    const dx = e.nativeEvent.translationX;

    if (dx > 35) {
      Animated.spring(translateX, {
        toValue: SCREEN_WIDTH,
        useNativeDriver: true,
      }).start(() => onSwipeRight());
    } else if (dx < -100) {
      Animated.spring(translateX, {
        toValue: -SCREEN_WIDTH,
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
            {
              transform: [
                { translateX },
                { rotate }, // Kart döndürülüyor
              ],
            },
          ]}
        >
          {imageUrl && (
  <Image
    source={{ uri: imageUrl }}
    style={{ width: 100, height: 100, borderRadius: 10, marginBottom: 10 }}
    resizeMode="cover"
  />
)}
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
