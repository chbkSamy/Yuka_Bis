import { getDatabase } from '../db';

export interface Product {
    id?: number;
    barcode: string;
    product_name?: string;
    brands?: string;
    ingredients_text?: string;
    allergens?: string;
    image_url?: string;
    nutriscore_grade?: string;
    is_halal?: number;
    is_kosher?: number;
    is_vegan?: number;
    is_vegetarian?: number;
    // Nutritional information per 100g
    energy_100g?: number;
    proteins_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
    created_at?: number;
}

/**
 * Insère un produit dans la base de données
 */
export const insertProduct = async (product: Product): Promise<number> => {
    const db = getDatabase();

    try {
        const result = await db.runAsync(
            `INSERT OR REPLACE INTO products
       (barcode, product_name, brands, ingredients_text, allergens, image_url,
        nutriscore_grade, is_halal, is_kosher, is_vegan, is_vegetarian,
        energy_100g, proteins_100g, fat_100g, carbohydrates_100g)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                product.barcode,
                product.product_name || null,
                product.brands || null,
                product.ingredients_text || null,
                product.allergens || null,
                product.image_url || null,
                product.nutriscore_grade || null,
                product.is_halal || 0,
                product.is_kosher || 0,
                product.is_vegan || 0,
                product.is_vegetarian || 0,
                product.energy_100g || null,
                product.proteins_100g || null,
                product.fat_100g || null,
                product.carbohydrates_100g || null,
            ]
        );

        console.log(`✅ Produit ${product.barcode} inséré (ID: ${result.lastInsertRowId})`);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('❌ Erreur insertion produit:', error);
        throw error;
    }
};

/**
 * Récupère un produit par son code-barres
 */
export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
    const db = getDatabase();

    try {
        const result = await db.getFirstAsync<Product>(
            'SELECT * FROM products WHERE barcode = ?',
            [barcode]
        );

        return result || null;
    } catch (error) {
        console.error('❌ Erreur récupération produit:', error);
        throw error;
    }
};

/**
 * Récupère tous les produits
 */
export const getAllProducts = async (): Promise<Product[]> => {
    const db = getDatabase();

    try {
        const results = await db.getAllAsync<Product>(
            'SELECT * FROM products ORDER BY created_at DESC'
        );

        return results;
    } catch (error) {
        console.error('❌ Erreur récupération produits:', error);
        throw error;
    }
};

/**
 * Supprime un produit par son code-barres
 */
export const deleteProduct = async (barcode: string): Promise<void> => {
    const db = getDatabase();

    try {
        await db.runAsync('DELETE FROM products WHERE barcode = ?', [barcode]);
        console.log(`✅ Produit ${barcode} supprimé`);
    } catch (error) {
        console.error('❌ Erreur suppression produit:', error);
        throw error;
    }
};
