import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useWordStore } from '../stores/wordStore';
import { useThemeStore } from '../stores/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Stack } from 'expo-router';

export default function KnownWords() {
  const { knownWords } = useWordStore();
  const { colors, mode } = useThemeStore();

  const renderKnownWordItem = ({ item }: { item: any }) => (
    <View style={[styles.wordItem, { 
      backgroundColor: colors.card,
      shadowColor: colors.shadow.color,
      shadowOpacity: colors.shadow.opacity,
    }]}>
      <View style={styles.wordContent}>
        <Text style={[styles.wordText, { color: colors.text.primary }]}>{item.word}</Text>
        <Text style={[styles.translationText, { color: colors.text.secondary }]}>{item.translation}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[colors.secondary, colors.danger]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text.white} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text.white }]}>Bilinen Kelimeler</Text>
            <View style={styles.placeholder} />
          </View>

          <FlatList
            data={knownWords}
            renderItem={renderKnownWordItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </LinearGradient>
    </>
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
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    paddingBottom: 20,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 5,
  },
  wordContent: {
    flex: 1,
  },
  wordText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  translationText: {
    fontSize: 16,
    marginTop: 5,
  },
}); 