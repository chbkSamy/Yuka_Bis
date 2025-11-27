import { getDatabase } from '../database/db';
import { addScanToHistory } from '../database/queries/history';
import { insertProduct } from '../database/queries/products';

/**
 * Crée des données de test pour l'historique des scans
 * Utile pour tester l'interface sans avoir à scanner de vrais produits
 */
export const createSampleData = async (): Promise<void> => {
    try {
        const sampleProducts = [
            {
                barcode: '3017620422003',
                product_name: 'Nutella',
                brands: 'Ferrero',
                ingredients_text: 'Sucre, huile de palme, noisettes, cacao maigre, lait écrémé en poudre',
                allergens: 'Noisettes, Lait',
                image_url: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_fr.jpg',
                nutriscore_grade: 'e',
                is_halal: 0,
                is_vegan: 0,
            },
            {
                barcode: '5449000000996',
                product_name: 'Coca-Cola',
                brands: 'Coca-Cola',
                ingredients_text: 'Eau gazéifiée, sucre, colorant E150d, acidifiant E338, arômes naturels',
                allergens: '',
                image_url: 'https://images.openfoodfacts.org/images/products/544/900/000/0996/front_fr.jpg',
                nutriscore_grade: 'd',
                is_halal: 1,
                is_vegan: 1,
            },
            {
                barcode: '7622210449283',
                product_name: 'Milka Chocolat au Lait',
                brands: 'Milka',
                ingredients_text: 'Sucre, beurre de cacao, lait écrémé en poudre, pâte de cacao',
                allergens: 'Lait',
                image_url: 'https://images.openfoodfacts.org/images/products/762/221/044/9283/front_fr.jpg',
                nutriscore_grade: 'c',
                is_halal: 0,
                is_vegan: 0,
            },
            {
                barcode: '3228857000852',
                product_name: 'Eau Evian',
                brands: 'Evian',
                ingredients_text: 'Eau minérale naturelle',
                allergens: '',
                image_url: 'https://images.openfoodfacts.org/images/products/322/885/700/0852/front_fr.jpg',
                nutriscore_grade: 'a',
                is_halal: 1,
                is_vegan: 1,
            },
            {
                barcode: '3560070734689',
                product_name: 'Pringles Original',
                brands: 'Pringles',
                ingredients_text: 'Pommes de terre déshydratées, huiles végétales, farine de blé',
                allergens: 'Gluten',
                image_url: 'https://images.openfoodfacts.org/images/products/356/007/073/4689/front_fr.jpg',
                nutriscore_grade: 'd',
                is_halal: 1,
                is_vegan: 0,
            },
        ];

        console.log('🔄 Création des données de test...');

        for (const product of sampleProducts) {
            // Insérer le produit
            await insertProduct(product);

            // Ajouter à l'historique (compatible ou non aléatoirement)
            const isCompatible = Math.random() > 0.3; // 70% compatible
            await addScanToHistory(product.barcode, isCompatible);

            // Petit délai pour avoir des timestamps différents
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('✅ Données de test créées avec succès');
    } catch (error) {
        console.error('❌ Erreur création données de test:', error);
        throw error;
    }
};

/**
 * Vérifie si des données existent déjà dans la base
 */
export const hasSampleData = async (): Promise<boolean> => {
    const db = getDatabase();

    try {
        const result = await db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM scan_history'
        );

        return (result?.count || 0) > 0;
    } catch (error) {
        console.error('❌ Erreur vérification données:', error);
        return false;
    }
};
