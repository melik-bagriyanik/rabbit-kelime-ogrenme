import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ActivityIndicator, Image } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { useThemeStore } from '../stores/themeStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  word: string;
  translation?: string;
  imageUrl?: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

export default function WordCard({ word, translation, onSwipeRight, onSwipeLeft, imageUrl }: Props) {
  const colors = useThemeStore((state) => state.colors);
  const translateX = new Animated.Value(0);
  const [loading, setLoading] = useState(true); // Yüklenme durumu

  const rotate = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-20deg', '0deg', '20deg'],
    extrapolate: 'clamp',
  });

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );
  
  // yeni kelime geldiğinde loadingi true yapıyorum çünkü eski resim gelmesin 
  useEffect(() => {
    setLoading(true);
  }, [imageUrl]);

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
    <GestureHandlerRootView style={{ height: 'auto' }}>
      <PanGestureHandler  onGestureEvent={handleGesture} onEnded={handleEnd}>
        <Animated.View
          style={[
            cardStyle,
            {
              transform: [
                { translateX },
                { rotate },
              ],
            },
          ]}
        >
          {imageUrl && (
            <View style={styles.imageContainer}>
              {loading && (
                <View style={styles.loader}>
                  <ActivityIndicator size="small" color="#999" />
                </View>
              )}
              <Image
                source={{ uri: imageUrl ? imageUrl : 'https://via.placeholder.com/300' }}
                style={styles.image}
                resizeMode="cover"
                onLoadEnd={() => setLoading(false)} // Resim yüklenince loading kapat
              />
            </View>
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
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 5,
    paddingBottom: 20,
    alignItems: 'center',
  
    overflow: 'hidden', // Bu çok önemli, yoksa image taşabilir
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#eee', // Arka plan rengi (skeleton gibi)
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
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
