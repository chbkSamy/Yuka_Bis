import { Product } from '../database/queries/products';

const API_BASE_URL = 'https://world.openfoodfacts.org/api/v2/product';

export interface OpenFoodFactsResponse {
    code: string;
    product: any;
    status: number;
    status_verbose: string;
}

/**
 * Récupère les informations d'un produit depuis l'API Open Food Facts
 * @param barcode Code-barres du produit
 * @returns Promesse avec les données du produit ou null si non trouvé
 */
export const fetchProductFromApi = async (barcode: string): Promise<Product | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/${barcode}.json`);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: OpenFoodFactsResponse = await response.json();

        if (data.status !== 1 || !data.product) {
            console.log(`Produit non trouvé sur Open Food Facts: ${barcode}`);
            return null;
        }

        const product = data.product;

        // Mappage des données de l'API vers notre format local
        return {
            barcode: data.code,
            product_name: product.product_name || product.product_name_fr || 'Produit inconnu',
            brands: product.brands || '',
            ingredients_text: product.ingredients_text || product.ingredients_text_fr || '',
            allergens: product.allergens || '',
            image_url: product.image_url || product.image_front_url || '',
            nutriscore_grade: product.nutriscore_grade || '',
            // Par défaut, on ne peut pas déterminer ces valeurs sans analyse plus poussée
            // On pourrait utiliser les champs 'labels_tags' ou 'ingredients_analysis_tags' de l'API pour plus de précision
            is_halal: 0,
            is_kosher: 0,
            is_vegan: product.ingredients_analysis_tags?.includes('en:vegan') ? 1 : 0,
        };
    } catch (error) {
        console.error('❌ Erreur API Open Food Facts:', error);
        return null;
    }
};
