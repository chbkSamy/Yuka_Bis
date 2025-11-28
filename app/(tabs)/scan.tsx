import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { addScanToHistory } from '@/database/queries/history';
import { insertProduct } from '@/database/queries/products';
import { useScanner } from '@/hooks/useScanner';
import { fetchProductFromApi } from '@/services/openFoodFacts';
import { BarcodeScanningResult, CameraView } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ScanScreen = () => {
  const { hasPermission, requestPermission, openSettings } = useScanner();
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  // Lock to prevent rapid duplicate scans before state updates
  const scanLock = useRef(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (hasPermission === false) {
      Alert.alert(
        "Permission requise",
        "L'accès à la caméra est nécessaire pour scanner les produits.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Ouvrir les paramètres", onPress: openSettings }
        ]
      );
    } else if (hasPermission === null) {
      requestPermission();
    }
  }, [hasPermission, requestPermission, openSettings]);

  // Reset scanner when screen comes into focus and manage camera active state
  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);
      scanLock.current = false;
      setIsScanning(true);
      setIsLoading(false);
      setScannedData(null);

      return () => {
        setIsCameraActive(false);
      };
    }, [])
  );

  const handleBarcodeScanned = useCallback(async ({ data }: BarcodeScanningResult) => {
    // Check lock first to prevent race conditions
    if (scanLock.current || !isScanning || isLoading || data === scannedData) return;

    scanLock.current = true;
    setScannedData(data);
    setIsScanning(false);
    setIsLoading(true);

    try {
      console.log(`🔍 Code-barres détecté: ${data}`);

      // 1. Récupérer les infos du produit
      const product = await fetchProductFromApi(data);

      if (product) {
        // 2. Sauvegarder en base locale
        await insertProduct(product);

        // 3. Ajouter à l'historique
        const isCompatible = true;
        await addScanToHistory(data, isCompatible);

        // Navigation vers la page de détails
        router.push({
          pathname: "/details",
          params: { barcode: data }
        });

        // Note: We do NOT reset state here.
        // useFocusEffect will handle the reset when the user returns to this screen.
      } else {
        Alert.alert(
          "Produit inconnu",
          "Ce produit n'a pas été trouvé dans la base Open Food Facts.",
          [
            {
              text: "Scanner à nouveau",
              onPress: () => {
                scanLock.current = false;
                setIsScanning(true);
                setIsLoading(false);
                setScannedData(null);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error("Erreur lors du scan:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors du traitement du scan.");

      // Reset on error to allow trying again
      scanLock.current = false;
      setIsScanning(true);
      setIsLoading(false);
      setScannedData(null);
    }
  }, [isScanning, isLoading, scannedData]);

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.permissionContainer}>
          <IconSymbol name="video.slash.fill" size={60} color="#ff4444" />
          <ThemedText style={styles.permissionText}>
            L'accès à la caméra est refusé
          </ThemedText>
          <TouchableOpacity style={styles.button} onPress={openSettings}>
            <ThemedText style={styles.buttonText}>Ouvrir les paramètres</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isCameraActive && (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={isScanning && !isLoading ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_a", "qr"],
            }}
          />
        )}

        {/* Overlay de visée */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <ThemedText style={styles.scanText}>
            Placez le code-barres dans le cadre
          </ThemedText>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Recherche du produit...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scanText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default ScanScreen;
