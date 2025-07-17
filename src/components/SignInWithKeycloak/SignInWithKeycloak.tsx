import { styles } from "@/components/SignInWithGoogle";

export const defaultKaycloakImageUrl = "https://i.imgur.com/pKFFuoh.png";
export const defaultKeycloakText = "KEYCLOAK";

export type SignInWithKeycloakProps = {
    imageUrl?: string;
    text?: string;
};

export function SignInWithKeycloak( props: Readonly<SignInWithKeycloakProps> ) {
    const { text, imageUrl } = props;

    return <a className={ styles.signInWithGoogle } href={ import.meta.env.VITE_UNIVERSIME_API + "/login/keycloak/auth" }>
        <img
            src={ imageUrl ?? defaultKaycloakImageUrl }
            alt={ text ?? defaultKeycloakText }
        /> { text ?? defaultKeycloakText }
    </a>;
}

export default SignInWithKeycloak;