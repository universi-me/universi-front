import { styles } from "@/components/SignInWithGoogle";

export function SignInWithKeycloak( props: Readonly<SignInWithKeycloakProps> ) {
    const { text, imageUrl } = props;

    return <a className={ styles.signInWithGoogle } href={ import.meta.env.VITE_UNIVERSIME_API + "/login/keycloak/auth" }>
        <img src={ imageUrl ?? "https://i.imgur.com/pKFFuoh.png" } alt="" height={ 69 } />
        { text ?? "KEYCLOAK" }
    </a>
}

export type SignInWithKeycloakProps = {
    imageUrl?: string;
    text?: string;
};
