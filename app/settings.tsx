import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getUserPreferences, saveUserPreference } from '@/database/queries/preferences';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

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
  const [expanded, setExpanded] = useState<string | null>('predefinie');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await getUserPreferences();
      setChecked(prefs);
    } catch (error) {
      console.error('Erreur chargement préférences:', error);
    }
  };

  const toggleCategory = (category: string) => {
    setExpanded(expanded === category ? null : category);
  };

  const toggleOption = async (option: string) => {
    const newValue = !checked[option];
    setChecked((prev) => ({ ...prev, [option]: newValue }));

    try {
      await saveUserPreference(option, newValue);
    } catch (error) {
      console.error('Erreur sauvegarde préférence:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Paramètres' }} />
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
                <ThemedText style={styles.categoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</ThemedText>
                <IconSymbol name={expanded === category ? 'chevron.down' : 'chevron.right'} size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
              </TouchableOpacity>
              {expanded === category && (
                <View style={styles.optionsContainer}>
                  {options.map((option) => (
                    <TouchableOpacity key={option} onPress={() => toggleOption(option)} style={styles.option}>
                      <ThemedText style={styles.optionText}>{option}</ThemedText>
                      <IconSymbol
                        name={checked[option] ? 'checkmark.square.fill' : 'square'}
                        size={24}
                        color={checked[option] ? '#007AFF' : '#999'}
                      />
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
