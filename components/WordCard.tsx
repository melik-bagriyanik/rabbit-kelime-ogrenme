import React from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WordCardProps {
  word: string;
  translation: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  loading?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ word, translation, onSwipeRight, onSwipeLeft, loading = false }) => {
  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(pan, {
            toValue: { x: 500, y: 0 },
            useNativeDriver: false
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            onSwipeRight();
          });
        } else if (gestureState.dx < -120) {
          Animated.spring(pan, {
            toValue: { x: -500, y: 0 },
            useNativeDriver: false
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            onSwipeLeft();
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            {
              rotate: pan.x.interpolate({
                inputRange: [-200, 0, 200],
                outputRange: ['-10deg', '0deg', '10deg']
              })
            }
          ]
        }
      ]}
      {...panResponder.panHandlers}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View style={styles.cardContent}>
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.translation}>{translation}</Text>
          </View>
          <View style={styles.iconsContainer}>
            <Ionicons name="checkmark-circle" size={40} color="green" style={styles.rightIcon} />
            <Ionicons name="refresh-circle" size={40} color="red" style={styles.leftIcon} />
          </View>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  translation: {
    fontSize: 18,
    color: '#666',
  },
  iconsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  rightIcon: {
    position: 'absolute',
    right: 20,
    opacity: 0.3,
  },
  leftIcon: {
    position: 'absolute',
    left: 20,
    opacity: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WordCard; 