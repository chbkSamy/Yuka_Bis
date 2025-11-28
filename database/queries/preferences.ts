import { getDatabase } from '../db';

export interface UserPreference {
    id: number;
    preference_key: string;
    preference_value: string;
}

/**
 * Récupère toutes les préférences utilisateur
 */
export const getUserPreferences = async (): Promise<Record<string, boolean>> => {
    const db = getDatabase();
    const rows = await db.getAllAsync<UserPreference>('SELECT * FROM user_preferences');

    const preferences: Record<string, boolean> = {};
    rows.forEach(row => {
        preferences[row.preference_key] = row.preference_value === 'true';
    });

    return preferences;
};

/**
 * Sauvegarde une préférence utilisateur
 */
export const saveUserPreference = async (key: string, value: boolean): Promise<void> => {
    const db = getDatabase();
    const stringValue = value ? 'true' : 'false';

    // Vérifier si la préférence existe déjà
    const existing = await db.getFirstAsync('SELECT * FROM user_preferences WHERE preference_key = ?', [key]);

    if (existing) {
        await db.runAsync('UPDATE user_preferences SET preference_value = ? WHERE preference_key = ?', [stringValue, key]);
    } else {
        await db.runAsync('INSERT INTO user_preferences (preference_key, preference_value) VALUES (?, ?)', [key, stringValue]);
    }
};
