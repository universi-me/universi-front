import { useEffect } from 'react';

const useUmami = () => {
    useEffect(() => {
        const umamiUrl = import.meta.env.VITE_UMAMI_URL;
        const umamiId = import.meta.env.VITE_UMAMI_ID;

        if ( umamiId && umamiUrl ) {
            const script = document.createElement('script');
            script.src = umamiUrl;
            script.async = true;
            script.dataset.websiteId = umamiId;
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            }
        }
    }, []);
};

export default useUmami;