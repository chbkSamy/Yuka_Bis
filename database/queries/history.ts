import { getDatabase } from '../db';

export interface ScanHistory {
    id?: number;
    barcode: string;
    scanned_at?: number;
    is_compatible?: number;
    // Jointure avec products
    product_name?: string;
    brands?: string;
    image_url?: string;
    nutriscore_grade?: string;
}

/**
 * Ajoute un scan à l'historique
 */
export const addScanToHistory = async (
    barcode: string,
    isCompatible: boolean = true
): Promise<number> => {
    const db = getDatabase();

    try {
        const result = await db.runAsync(
            'INSERT INTO scan_history (barcode, is_compatible) VALUES (?, ?)',
            [barcode, isCompatible ? 1 : 0]
        );

        console.log(`✅ Scan ajouté à l'historique (ID: ${result.lastInsertRowId})`);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('❌ Erreur ajout historique:', error);
        throw error;
    }
};

/**
 * Récupère l'historique des scans (avec infos produits)
 * @param limit Nombre maximum de résultats (par défaut 50)
 */
export const getScanHistory = async (limit: number = 50): Promise<ScanHistory[]> => {
    const db = getDatabase();

    try {
        const results = await db.getAllAsync<ScanHistory>(
            `SELECT
        h.id, h.barcode, h.scanned_at, h.is_compatible,
        p.product_name, p.brands, p.image_url, p.nutriscore_grade
       FROM scan_history h
       LEFT JOIN products p ON h.barcode = p.barcode
       ORDER BY h.scanned_at DESC
       LIMIT ?`,
            [limit]
        );

        return results;
    } catch (error) {
        console.error('❌ Erreur récupération historique:', error);
        throw error;
    }
};

/**
 * Compte le nombre total de scans dans l'historique
 */
export const getScanHistoryCount = async (): Promise<number> => {
    const db = getDatabase();

    try {
        const result = await db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM scan_history'
        );

        return result?.count || 0;
    } catch (error) {
        console.error('❌ Erreur comptage historique:', error);
        throw error;
    }
};

/**
 * Supprime tout l'historique
 */
export const clearHistory = async (): Promise<void> => {
    const db = getDatabase();

    try {
        await db.runAsync('DELETE FROM scan_history');
        console.log('✅ Historique supprimé');
    } catch (error) {
        console.error('❌ Erreur suppression historique:', error);
        throw error;
    }
};

/**
 * Supprime un élément spécifique de l'historique
 */
export const deleteScanHistoryItem = async (id: number): Promise<void> => {
    const db = getDatabase();

    try {
        await db.runAsync('DELETE FROM scan_history WHERE id = ?', [id]);
        console.log(`✅ Élément ${id} supprimé de l'historique`);
    } catch (error) {
        console.error('❌ Erreur suppression élément historique:', error);
        throw error;
    }
};
