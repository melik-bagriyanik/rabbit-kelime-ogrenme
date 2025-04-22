import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { useWordStore } from '../../stores/wordStore';
import { useThemeStore } from '../../stores/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Review() {
  const { unknownWords, removeUnknownWord } = useWordStore();
  const { colors, mode, toggleTheme } = useThemeStore();

  const handleDeleteWord = (wordId: number) => {
    removeUnknownWord(wordId);
  };

  const renderWordItem = ({ item }: { item: any }) => (
    <View style={[styles.wordItem, { 
      backgroundColor: colors.card,
      shadowColor: colors.shadow.color,
      shadowOpacity: colors.shadow.opacity,
    }]}>
      <View style={styles.wordContent}>
        <Text style={[styles.wordText, { color: colors.text.primary }]}>{item.word}</Text>
        <Text style={[styles.translationText, { color: colors.text.secondary }]}>{item.translation}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.deleteButton, { backgroundColor: `${colors.danger}20` }]}
        onPress={() => handleDeleteWord(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.secondary, colors.danger]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.white }]}>Tekrar Edilecek Kelimeler</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Ionicons 
              name={mode === 'dark' ? 'sunny' : 'moon'} 
              size={24} 
              color={colors.text.white} 
            />
          </TouchableOpacity>
        </View>
        {unknownWords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color={colors.text.white} />
            <Text style={[styles.emptyText, { color: colors.text.white }]}>
              Henüz tekrar edilecek kelime yok.
            </Text>
          </View>
        ) : (
          <FlatList
            data={unknownWords}
            renderItem={renderWordItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  deleteButton: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
