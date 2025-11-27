
import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, Stack } from 'expo-router';

const DetailScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: `Detail #${id}` }} />
      <ScrollView>
        <ThemedView style={styles.container}>
          <View style={styles.imagePlaceholder} />
          <ThemedText style={styles.titlePlaceholder}></ThemedText>
          <View style={styles.textBlockPlaceholder} />
          <View style={styles.textBlockPlaceholder} />
          <View style={styles.textBlockPlaceholder} />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#cccccc',
    borderRadius: 8,
    marginBottom: 24,
  },
  titlePlaceholder: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    height: 32,
    backgroundColor: '#e0e0e0',
    width: '80%',
  },
  textBlockPlaceholder: {
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
});

export default DetailScreen;
