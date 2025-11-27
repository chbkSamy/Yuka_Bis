import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Ouvre la connexion à la base de données SQLite
 * @returns Instance de la base de données
 */
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (db) return db;

    try {
        db = await SQLite.openDatabaseAsync('scanner_app.db');
        console.log('✅ Base de données ouverte avec succès');
        return db;
    } catch (error) {
        console.error('❌ Erreur lors de l\'ouverture de la DB:', error);
        throw error;
    }
};

/**
 * Ferme la connexion à la base de données
 */
export const closeDatabase = async (): Promise<void> => {
    if (db) {
        await db.closeAsync();
        db = null;
        console.log('✅ Base de données fermée');
    }
};

/**
 * Récupère l'instance de la DB (doit être ouverte au préalable)
 */
export const getDatabase = (): SQLite.SQLiteDatabase => {
    if (!db) {
        throw new Error('La base de données n\'est pas ouverte. Appelez openDatabase() d\'abord.');
    }
    return db;
};
