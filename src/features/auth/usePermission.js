import { useState, useEffect } from 'react';
import { getPermissionsFromToken } from '../Users/jwtUtils';
import { decryptToken } from '../../services/apiServices';

const usePermission = (permissionName) => {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const checkPermission = () => {
            const encryptedToken = localStorage.getItem('token');
            if (encryptedToken) {
                const token = decryptToken(encryptedToken);
                if (token) {
                    const permissions = getPermissionsFromToken(token);
                    setHasPermission(permissions.includes(permissionName));
                } else {
                    setHasPermission(false);
                }
            } else {
                setHasPermission(false);
            }
        };

        checkPermission();
        // Listen for storage changes in case token updates (optional but good for consistency)
        window.addEventListener('storage', checkPermission);

        return () => {
            window.removeEventListener('storage', checkPermission);
        };
    }, [permissionName]);

    return hasPermission;
};

export default usePermission;
