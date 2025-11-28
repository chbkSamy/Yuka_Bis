import { Product } from '../database/queries/products';

export interface DietCompatibility {
    isCompatible: boolean;
    incompatibleReasons: string[];
    illicitIngredients: string[];
}


const FORBIDDEN_INGREDIENTS: Record<string, string[]> = {
    'Vegan': [

        'oeuf',
        'œuf', 'blanc d\'oeuf', 'blanc d\'œuf', 'jaune d\'oeuf', 'jaune d\'œuf', 'poudre d\'oeuf', 'poudre d\'œuf',
        'albumine', 'viande', 'boeuf', 'bœuf', 'porc', 'jambon', 'bacon', 'lard', 'lardon', 'saindoux', 'poulet', 'dinde', 'volaille', 'agneau', 'mouton', 'veau',
        'charcuterie', 'gelée de viande', 'poisson', 'thon', 'saumon',
        'colin', 'cabillaud', 'anchois', 'crevette', 'crevettes', 'homard', 'crabe', 'moule', 'huître', 'huitre', 'calamar',
        'pieuvre', 'poulpe', 'fruits de mer', 'gélatine', 'gélatine porcine', 'collagène', 'graisse animale', 'suif', 'cochenille', 'carmin',
        'acide carminique', 'e120', 'miel', 'propolis', 'gelée royale', 'lécithine de viande',
    ],
    'Vegetarian': [
        'poisson', 'thon', 'saumon', 'colin', 'cabillaud', 'anchois', 'crevette', 'homard', 'crabe', 'moule', 'huître', 'huitre', 'calamar', 'pieuvre', 'poulpe', 'fruits de mer',
        'gélatine', 'gélatine porcine', 'collagène', 'graisse animale', 'suif', 'cochenille', 'carmin', 'acide carminique', 'e120',
        'présure animale', 'présure de veau',

    ],
    'Halal': [

        'alcool', 'éthanol', 'ethanol', 'vin', 'bière', 'cidre', 'rhum', 'whisky', 'whiskey', 'vodka', 'liqueur', 'cognac',
        'champagne', 'porto', 'saké', 'sake', 'spiritueux', 'extrait de rhum', 'arôme de rhum',
        'arôme de whisky', 'arôme de cognac',
        'gélatine', 'cochenille', 'carmin', 'acide carminique', 'e120', 'e441',

    ],
    'Kosher': [

'crevette','crevettes','homard','crabe','écrevisse','moule','huître','huitre','palourde','coquillage','calamar','pieuvre','poulpe','fruits de mer',
'bouillon de viande','graisse animale','gélatine','gélatine porcine',
'cochenille','carmin','acide carminique','e120',

    ]
};

export const checkDietCompatibility = (
    product: Product,
    preferences: Record<string, boolean>
): DietCompatibility => {
    const reasons: string[] = [];
    const illicitIngredients: Set<string> = new Set();
    let isCompatible = true;
    const ingredientsTextLower = (product.ingredients_text || '').toLowerCase();

    // Fonction utilitaire pour vérifier les ingrédients
    const checkIngredients = (dietName: string, label: string) => {
        if (preferences[dietName]) {

            if (dietName === 'Vegan' && product.is_vegan === 0) {
            }

            const forbiddenList = FORBIDDEN_INGREDIENTS[dietName] || [];
            const foundForbidden = forbiddenList.filter(ingredient =>
                ingredientsTextLower.includes(ingredient.toLowerCase())
            );

            if (foundForbidden.length > 0) {
                isCompatible = false;
                reasons.push(`Contient : ${foundForbidden.join(', ')} (${label})`);
                foundForbidden.forEach(ing => illicitIngredients.add(ing));
            }
        }
    };

    checkIngredients('Vegan', 'Vegan');
    checkIngredients('Vegetarian', 'Végétarien');
    checkIngredients('Halal', 'Halal');
    checkIngredients('Kosher', 'Casher');

    return {
        isCompatible,
        incompatibleReasons: reasons,
        illicitIngredients: Array.from(illicitIngredients),
    };
};
