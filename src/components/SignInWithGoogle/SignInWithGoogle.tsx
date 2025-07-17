import { useMemo } from "react";

import { oauthSignInUrl } from "@/services/oauth2-google";
import styles from "./SignInWithGoogle.module.less";

export const defaultGoogleImageUrl = "https://lh3.googleusercontent.com/d_S5gxu_S1P6NR1gXeMthZeBzkrQMHdI5uvXrpn3nfJuXpCjlqhLQKH_hbOxTHxFhp5WugVOEcl4WDrv9rmKBDOMExhKU5KmmLFQVg";
export const defaultGoogleText = "EMAIL GOOGLE";

export type SignInWithGoogleProps = {
    imageUrl?: string;
    text?: string;
    client_id: string;
};

export function SignInWithGoogle(props: Readonly<SignInWithGoogleProps>) {
    const { client_id, text, imageUrl } = props;

    const href = useMemo(() => {
        return oauthSignInUrl({ client_id }).toString();
    }, [ client_id ]);

    return <a className={styles.signInWithGoogle} href={ href }>
        <img
            src={ imageUrl ?? defaultGoogleImageUrl }
            alt={ text ?? defaultGoogleText }
        /> { text ?? defaultGoogleText }
    </a>;
}

export default SignInWithGoogle;
