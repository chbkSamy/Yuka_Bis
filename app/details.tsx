import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductByBarcode, Product } from '@/database/queries/products';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { getUserPreferences } from '@/database/queries/preferences';
import { checkDietCompatibility } from '@/utils/diet';

const DetailScreen = () => {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompatible, setIsCompatible] = useState(true);
  const [incompatibleReasons, setIncompatibleReasons] = useState<string[]>([]);
  const [illicitIngredients, setIllicitIngredients] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const loadProductAndPrefs = async () => {
      if (barcode) {
        try {
          const [productData, prefs] = await Promise.all([
            getProductByBarcode(barcode),
            getUserPreferences()
          ]);

          setProduct(productData);

          if (productData) {
            const compatibility = checkDietCompatibility(productData, prefs);
            setIsCompatible(compatibility.isCompatible);
            setIncompatibleReasons(compatibility.incompatibleReasons);
            setIllicitIngredients(compatibility.illicitIngredients);
            setWarnings(compatibility.warnings);
          }
        } catch (error) {
          console.error("Error loading product:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadProductAndPrefs();
  }, [barcode]);

  const renderIngredients = (text: string | undefined) => {
    if (!text) return "Aucune liste d&apos;ingrédients disponible.";
    if (illicitIngredients.length === 0) return <ThemedText style={styles.body}>{text}</ThemedText>;

    // Create a regex pattern to match any of the illicit ingredients (case insensitive)
    // We escape special characters just in case
    const pattern = new RegExp(`(${illicitIngredients.map(ing => ing.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

    const parts = text.split(pattern);

    return (
      <ThemedText style={styles.body}>
        {parts.map((part, index) => {
          const isIllicit = illicitIngredients.some(ing => ing.toLowerCase() === part.toLowerCase());
          return isIllicit ? (
            <ThemedText key={index} style={{ color: '#ff3b30', fontWeight: 'bold' }}>
              {part}
            </ThemedText>
          ) : (
            <ThemedText key={index}>{part}</ThemedText>
          );
        })}
      </ThemedText>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ThemedText>Produit non trouvé</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const getNutriScoreColor = (grade: string | undefined) => {
    switch (grade?.toLowerCase()) {
        case 'a': return '#008C4A'; // Dark Green
        case 'b': return '#8CC63E'; // Light Green
        case 'c': return '#FFCC00'; // Yellow
        case 'd': return '#EE7600'; // Orange
        case 'e': return '#E4002B'; // Red
        default: return '#808080'; // Grey for unknown
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: product.product_name || 'Détails produit' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.container}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={styles.imagePlaceholder}>
                <ThemedText>Pas d'image</ThemedText>
            </View>
          )}

          <ThemedText type="title" style={styles.title}>{product.product_name}</ThemedText>
          <ThemedText style={styles.brand}>{product.brands}</ThemedText>

          {incompatibleReasons.length > 0 && (
            <View style={styles.warningContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={32} color="#fff" />
              <View style={styles.warningTextContainer}>
                <ThemedText style={styles.warningTitle}>PRODUIT ILLICITE</ThemedText>
                <ThemedText style={styles.warningText}>
                  Incompatible avec vos régimes : {incompatibleReasons.join(', ')}
                </ThemedText>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <ThemedText type="subtitle">Nutriscore</ThemedText>
            <ThemedText style={[styles.nutriscoreValue, { backgroundColor: getNutriScoreColor(product.nutriscore_grade) }]}>
                {product.nutriscore_grade?.toUpperCase() ?? 'Inconnu'}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle">Ingrédients</ThemedText>
            {renderIngredients(product.ingredients_text)}
          </View>

           <View style={styles.section}>
            <ThemedText type="subtitle">Allergènes</ThemedText>
            <ThemedText style={styles.body}>
              {product.allergens || "Aucun allergène signalé."}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle">Informations Nutritionnelles (pour 100g)</ThemedText>
            <View style={styles.nutritionFactsContainer}>
              <ThemedText style={styles.nutritionFactLabel}>Énergie:</ThemedText>
              <ThemedText style={styles.nutritionFactValue}>{product.energy_100g ? `${product.energy_100g} kcal` : 'N/A'}</ThemedText>
            </View>
            <View style={styles.nutritionFactsContainer}>
              <ThemedText style={styles.nutritionFactLabel}>Protéines:</ThemedText>
              <ThemedText style={styles.nutritionFactValue}>{product.proteins_100g ? `${product.proteins_100g}g` : 'N/A'}</ThemedText>
            </View>
            <View style={styles.nutritionFactsContainer}>
              <ThemedText style={styles.nutritionFactLabel}>Matières grasses:</ThemedText>
              <ThemedText style={styles.nutritionFactValue}>{product.fat_100g ? `${product.fat_100g}g` : 'N/A'}</ThemedText>
            </View>
            <View style={styles.nutritionFactsContainer}>
              <ThemedText style={styles.nutritionFactLabel}>Glucides:</ThemedText>
              <ThemedText style={styles.nutritionFactValue}>{product.carbohydrates_100g ? `${product.carbohydrates_100g}g` : 'N/A'}</ThemedText>
            </View>
          </View>

        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Or use theme color
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#eee',
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brand: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  nutriscoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast on colored background
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start', // To make the background color only around the text
    marginTop: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 4,
  },
  warningContainer: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  warningTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningText: {
    color: '#fff',
    fontSize: 14,
  },
  nutritionFactsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  nutritionFactLabel: {
    fontSize: 16,
  },
  nutritionFactValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailScreen;
