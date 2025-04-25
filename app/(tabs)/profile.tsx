import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useWordStore } from '../../stores/wordStore';
import { useThemeStore } from '../../stores/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function Profile() {
  const { knownWords } = useWordStore();
  const { colors, mode, toggleTheme } = useThemeStore();

  // Örnek kullanıcı bilgileri (gerçek uygulamada bu bilgiler bir API'den veya local storage'dan gelecektir)
  const userInfo = {
    username: 'Kullanıcı Adı',
    email: 'kullanici@email.com',
  };

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
          <Text style={[styles.title, { color: colors.text.white }]}>Profil</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Ionicons 
              name={mode === 'dark' ? 'sunny' : 'moon'} 
              size={24} 
              color={colors.text.white} 
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.profileCard, { 
          backgroundColor: colors.card,
          shadowColor: colors.shadow.color,
          shadowOpacity: colors.shadow.opacity,
        }]}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={colors.primary} />
          </View>
          <Text style={[styles.username, { color: colors.text.primary }]}>{userInfo.username}</Text>
          <Text style={[styles.email, { color: colors.text.secondary }]}>{userInfo.email}</Text>
          
          <TouchableOpacity 
            style={[styles.knownWordsButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/known-words')}
          >
            <Text style={[styles.knownWordsButtonText, { color: colors.text.white }]}>
              Bilinen Kelimeler ({knownWords.length})
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={colors.text.white} 
            />
          </TouchableOpacity>
        </View>
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
  profileCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  knownWordsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  knownWordsButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
}); 