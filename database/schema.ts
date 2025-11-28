import { getDatabase } from './db';

/**
 * Initialise toutes les tables de la base de données
 */
export const initializeDatabase = async (): Promise<void> => {
  const db = getDatabase();

  try {
    // Table des produits
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode TEXT UNIQUE NOT NULL,
        product_name TEXT,
        brands TEXT,
        ingredients_text TEXT,
        allergens TEXT,
        image_url TEXT,
        nutriscore_grade TEXT,
        is_halal INTEGER DEFAULT 0,
        is_kosher INTEGER DEFAULT 0,
        is_vegan INTEGER DEFAULT 0,
        is_vegetarian INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);

    // Migration pour ajouter la colonne is_vegetarian si elle n'existe pas (pour les utilisateurs existants)
    try {
      await db.execAsync('ALTER TABLE products ADD COLUMN is_vegetarian INTEGER DEFAULT 0');
    } catch (error) {
      // La colonne existe probablement déjà, on ignore l'erreur
    }

    // Table de l'historique
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode TEXT NOT NULL,
        scanned_at INTEGER DEFAULT (strftime('%s', 'now')),
        is_compatible INTEGER DEFAULT 1,
        FOREIGN KEY (barcode) REFERENCES products(barcode)
      );
    `);

    // Table des préférences utilisateur
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        preference_key TEXT UNIQUE NOT NULL,
        preference_value TEXT NOT NULL
      );
    `);

    // Table des favoris
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode TEXT UNIQUE NOT NULL,
        added_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (barcode) REFERENCES products(barcode)
      );
    `);

    // Index pour améliorer les performances
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
      CREATE INDEX IF NOT EXISTS idx_scan_history_barcode ON scan_history(barcode);
      CREATE INDEX IF NOT EXISTS idx_scan_history_scanned_at ON scan_history(scanned_at);
      CREATE INDEX IF NOT EXISTS idx_favorites_barcode ON favorites(barcode);
    `);

    console.log('✅ Schéma de la base de données initialisé');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation du schéma:', error);
    throw error;
  }
};

/**
 * Réinitialise complètement la base de données (ATTENTION : supprime toutes les données)
 */
export const resetDatabase = async (): Promise<void> => {
  const db = getDatabase();

  await db.execAsync(`
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS scan_history;
    DROP TABLE IF EXISTS user_preferences;
    DROP TABLE IF EXISTS products;
  `);

  await initializeDatabase();
  console.log('✅ Base de données réinitialisée');
};
