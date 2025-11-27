import { useCallback, useEffect, useState } from 'react';
import { getScanHistory, ScanHistory } from '../database/queries/history';

/**
 * Hook pour récupérer et gérer l'historique des scans
 * @param limit Nombre maximum d'éléments à récupérer (par défaut 50)
 * @returns {history: ScanHistory[], isLoading: boolean, error: Error | null, refresh: () => Promise<void>}
 */
export const useScanHistory = (limit: number = 50) => {
    const [history, setHistory] = useState<ScanHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadHistory = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getScanHistory(limit);
            setHistory(data);
            console.log(`✅ ${data.length} éléments chargés dans l'historique`);
        } catch (err) {
            console.error('❌ Erreur chargement historique:', err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    // Fonction pour rafraîchir manuellement l'historique
    const refresh = useCallback(async () => {
        await loadHistory();
    }, [loadHistory]);

    return { history, isLoading, error, refresh };
};
