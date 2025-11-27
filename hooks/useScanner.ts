import { PermissionStatus, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

export const useScanner = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        if (permission) {
            setHasPermission(permission.status === PermissionStatus.GRANTED);
        }
    }, [permission]);

    const requestCameraPermission = useCallback(async () => {
        const result = await requestPermission();
        setHasPermission(result.status === PermissionStatus.GRANTED);
        return result.status === PermissionStatus.GRANTED;
    }, [requestPermission]);

    const openSettings = useCallback(async () => {
        await Linking.openSettings();
    }, []);

    return {
        hasPermission,
        requestPermission: requestCameraPermission,
        openSettings,
    };
};
