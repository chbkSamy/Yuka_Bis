import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const settingsData = [
  {
    category: 'predefinie',
    options: ['Halal', 'Vegan', 'Vegetarian', 'Kosher'],
  },
  {
    category: 'allergens',
    options: ['oeuf', 'lait', 'miel', 'arachides', 'gluten', 'soja'],
  },
  {
    category: 'nocif',
    options: ['javel', 'gazoil', 'e23659'],
  },
];

const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const [expanded, setExpanded] = useState<string | null>('Notifications');
  const [checked, setChecked] = useState<Record<string, boolean>>({
    'Push Notifications': true,
    'System Default': true,
  });

  const toggleCategory = (category: string) => {
    setExpanded(expanded === category ? null : category);
  };

  const toggleOption = (option: string) => {
    setChecked((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Settings' }} />
      <ScrollView>
        <ThemedView style={styles.container}>
          {settingsData.map(({ category, options }) => (
            <View
              key={category}
              style={[
                styles.categoryContainer,
                { backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f0f0f0' }
              ]}
            >
              <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
                <ThemedText style={styles.categoryTitle}>{category}</ThemedText>
                <IconSymbol name={expanded === category ? 'chevron.down' : 'chevron.right'} size={20} />
              </TouchableOpacity>
              {expanded === category && (
                <View style={styles.optionsContainer}>
                  {options.map((option) => (
                    <TouchableOpacity key={option} onPress={() => toggleOption(option)} style={styles.option}>
                      <ThemedText style={styles.optionText}>{option}</ThemedText>
                      <IconSymbol name={checked[option] ? 'checkmark.square.fill' : 'square'} size={24} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
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
  categoryContainer: {
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
  },
});

export default SettingsScreen;
