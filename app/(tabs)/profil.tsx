
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const ProfilScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <Link href="/settings" style={styles.settingsButton}>
          <IconSymbol name="gear" size={28} color={"#ECEDEE"} />
        </Link>
        <View style={styles.header}>
          <View style={styles.profilePicPlaceholder} />
          <View style={styles.headerText}>
            <ThemedText style={styles.namePlaceholder}></ThemedText>
            <ThemedText style={styles.usernamePlaceholder}></ThemedText>
          </View>
        </View>



        <View style={styles.bioPlaceholder}>
        </View>

        <View style={styles.gridContainer}>
          {[...Array(9)].map((_, index) => (
            <View key={index} style={styles.gridItem} />
          ))}
        </View>
      </ThemedView>
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
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#cccccc',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  namePlaceholder: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    width: '70%',
    height: 28,
    marginBottom: 8,
  },
  usernamePlaceholder: {
    fontSize: 16,
    backgroundColor: '#e0e0e0',
    width: '50%',
    height: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
  },
  bioPlaceholder: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '32%',
    height: 120,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    borderRadius: 8,
  },
});

export default ProfilScreen;
