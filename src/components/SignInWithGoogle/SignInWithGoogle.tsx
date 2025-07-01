import { useMemo } from "react";

import { oauthSignInUrl } from "@/services/oauth2-google";
import styles from "./SignInWithGoogle.module.less";

export type SignInWithGoogleProps = {
    client_id: string;
    text?: string;
    imageUrl?: string;
};

export function SignInWithGoogle(props: Readonly<SignInWithGoogleProps>) {
    const { client_id, text, imageUrl } = props;

    const renderedText = text ?? "EMAIL GOOGLE";
    const imageSrc = imageUrl ?? "https://lh3.googleusercontent.com/d_S5gxu_S1P6NR1gXeMthZeBzkrQMHdI5uvXrpn3nfJuXpCjlqhLQKH_hbOxTHxFhp5WugVOEcl4WDrv9rmKBDOMExhKU5KmmLFQVg";

    const href = useMemo(() => {
        return oauthSignInUrl({ client_id }).toString();
    }, [ client_id ]);

    return <a className={styles.signInWithGoogle} href={ href }>
        <img
            src={ imageSrc }
            alt={ renderedText }
        /> { renderedText }
    </a>;
}

export default SignInWithGoogle;
