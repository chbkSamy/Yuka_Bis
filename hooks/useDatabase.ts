import { useEffect, useState } from 'react';
import { closeDatabase, openDatabase } from '../database/db';
import { initializeDatabase } from '../database/schema';

/**
 * Hook pour initialiser et gérer la base de données SQLite
 * @returns {isReady: boolean, error: Error | null}
 */
export const useDatabase = () => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const setupDatabase = async () => {
            try {
                await openDatabase();
                await initializeDatabase();
                setIsReady(true);
                console.log('✅ Base de données prête');
            } catch (err) {
                console.error('❌ Erreur initialisation DB:', err);
                setError(err as Error);
            }
        };

        setupDatabase();

        // Nettoyage lors du démontage
        return () => {
            closeDatabase();
        };
    }, []);

    return { isReady, error };
};
