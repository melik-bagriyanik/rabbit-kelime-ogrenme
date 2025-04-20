import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useWordStore } from '@/stores/wordStore';

export default function UnknownWordsScreen() {
  const unknownWords = useWordStore((state) => state.unknownWords);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bilinmeyen Kelimeler</Text>

      {unknownWords.length === 0 ? (
        <Text style={styles.emptyText}>Henüz bilinmeyen kelime yok.</Text>
      ) : (
        <FlatList
          data={unknownWords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.translation}>{item.translation}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 16,
    color: 'gray',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
    marginTop: 50,
  },
});
