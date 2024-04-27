import { useEffect } from 'react';

const useUmami = () => {
    useEffect(() => {
        if (import.meta.env.VITE_UMAMI_URL != '' && import.meta.env.VITE_UMAMI_ID != '') {
            const script = document.createElement('script') as HTMLScriptElement;
            script.src = import.meta.env.VITE_UMAMI_URL;
            script.async = true;
            script.dataset.websiteId = import.meta.env.VITE_UMAMI_ID;
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            }
        }
    }, []);
};

export default useUmami;