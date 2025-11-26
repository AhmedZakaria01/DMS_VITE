import { useState, useEffect } from 'react';
import { getPermissionsFromToken } from '../Users/jwtUtils';
import { decryptToken } from '../../services/apiServices';

const usePermission = (permissionName) => {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        // Early return if no permission name provided
        if (!permissionName) {
            setHasPermission(false);
            return;
        }

        const checkPermission = () => {
            try {
                const encryptedToken = localStorage.getItem('token');
                if (!encryptedToken) {
                    setHasPermission(false);
                    return;
                }

                const token = decryptToken(encryptedToken);
                if (!token) {
                    setHasPermission(false);
                    return;
                }

                const permissions = getPermissionsFromToken(token);
                setHasPermission(permissions.includes(permissionName));
            } catch (error) {
                console.error('Error checking permission:', error);
                setHasPermission(false);
            }
        };

        checkPermission();
        // Optional: Listen for storage changes
        window.addEventListener('storage', checkPermission);

        return () => {
            window.removeEventListener('storage', checkPermission);
        };
    }, [permissionName]);

    return hasPermission;
};

export default usePermission;