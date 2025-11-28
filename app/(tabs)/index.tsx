import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useScanHistory } from '@/hooks/useScanHistory';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

const HomeScreen = () => {
  const { history, isLoading, error, refresh } = useScanHistory(50);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  // Format timestamp to readable date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Date inconnue';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Historique des scans</ThemedText>

        {error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              ❌ Erreur: {error.message}
            </ThemedText>
          </View>
        )}

        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>Chargement de l'historique...</ThemedText>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>📦 Aucun produit scanné</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Commencez par scanner un code-barres !
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <ThemedText style={styles.countText}>
              {history.length} produit{history.length > 1 ? 's' : ''} scanné{history.length > 1 ? 's' : ''}
            </ThemedText>

            {history.map((item) => (
              <Link key={item.id} href={`/details?barcode=${item.barcode}`} asChild>
                <Pressable style={styles.historyItem}>
                  <View style={[
                    styles.itemIcon,
                    item.is_compatible ? styles.iconCompatible : styles.iconIncompatible
                  ]}>
                    <ThemedText style={styles.iconText}>
                      {item.is_compatible ? '✓' : '✗'}
                    </ThemedText>
                  </View>

                  <View style={styles.itemTextContainer}>
                    <ThemedText style={styles.itemTitle} numberOfLines={1}>
                      {item.product_name || 'Produit inconnu'}
                    </ThemedText>
                    <ThemedText style={styles.itemSubtitle} numberOfLines={1}>
                      {item.brands || item.barcode}
                    </ThemedText>
                    <ThemedText style={styles.itemDate}>
                      {formatDate(item.scanned_at)}
                    </ThemedText>
                  </View>

                  {item.nutriscore_grade && (
                    <View style={[
                      styles.nutriscoreBadge,
                      { backgroundColor: getNutriscoreColor(item.nutriscore_grade) }
                    ]}>
                      <ThemedText style={styles.nutriscoreText}>
                        {item.nutriscore_grade.toUpperCase()}
                      </ThemedText>
                    </View>
                  )}
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

// Helper function to get Nutriscore color
const getNutriscoreColor = (grade: string): string => {
  const colors: { [key: string]: string } = {
    'a': '#038141',
    'b': '#85BB2F',
    'c': '#FECB02',
    'd': '#EE8100',
    'e': '#E63E11',
  };
  return colors[grade.toLowerCase()] || '#999999';
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 35,
  },
  countText: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconCompatible: {
    backgroundColor: '#4CAF50',
  },
  iconIncompatible: {
    backgroundColor: '#F44336',
  },
  iconText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 11,
    opacity: 0.5,
  },
  nutriscoreBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  nutriscoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
