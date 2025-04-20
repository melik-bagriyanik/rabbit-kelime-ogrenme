import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const FreeDictionaryAPI = () => {
  const [wordsData, setWordsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const words = ['apple', 'house', 'car', 'tree', 'banana']; // Burada 100 kelimeyi listeleyebilirsiniz

  const fetchWordData = async (word: string) => {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      return response.data;
    } catch (error) {
      throw new Error(`Kelime verisi alınamadı: ${word}`);
    }
  };

  const fetchWordsData = async () => {
    try {
      const promises = words.map(word => fetchWordData(word)); // Kelimeler için paralel istekler
      const allWordsData = await Promise.all(promises);
      setWordsData(allWordsData);
      setLoading(false);
    } catch (error) {
      setError('Kelime verileri alınamadı!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWordsData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {wordsData.length > 0 ? (
        wordsData.map((wordData, index) => (
          <View key={index}>
            <Text style={styles.word}>Kelime: {wordData[0]?.word}</Text>
            {wordData[0]?.meanings?.map((meaning: any, meaningIndex: number) => (
              <View key={meaningIndex}>
                <Text style={styles.meaning}>Anlam: {meaning?.definitions[0]?.definition}</Text>
                <Text style={styles.example}>Örnek: {meaning?.definitions[0]?.example}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text>Kelime verisi mevcut değil.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  meaning: {
    fontSize: 18,
    marginTop: 10,
  },
  example: {
    fontSize: 16,
    color: 'gray',
  },
});

export default FreeDictionaryAPI;
