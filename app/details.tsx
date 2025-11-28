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
  const [incompatibleReasons, setIncompatibleReasons] = useState<string[]>([]);
  const [illicitIngredients, setIllicitIngredients] = useState<string[]>([]);

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
            if (!compatibility.isCompatible) {
              setIncompatibleReasons(compatibility.incompatibleReasons);
              setIllicitIngredients(compatibility.illicitIngredients);
            }
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
    if (!text) return "Aucune liste d'ingrédients disponible.";
    if (illicitIngredients.length === 0) return text;

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
            <ThemedText style={styles.value}>{product.nutriscore_grade?.toUpperCase() ?? 'Inconnu'}</ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle">Ingrédients</ThemedText>
            {/* We render the ingredients using the helper function */}
            {typeof renderIngredients(product.ingredients_text) === 'string' ? (
               <ThemedText style={styles.body}>{renderIngredients(product.ingredients_text)}</ThemedText>
            ) : (
               renderIngredients(product.ingredients_text)
            )}
          </View>

           <View style={styles.section}>
            <ThemedText type="subtitle">Allergènes</ThemedText>
            <ThemedText style={styles.body}>
              {product.allergens || "Aucun allergène signalé."}
            </ThemedText>
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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
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
});

export default DetailScreen;
