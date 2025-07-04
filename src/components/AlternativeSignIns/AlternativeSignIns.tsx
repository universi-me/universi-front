import SignInWithGoogle from "@/components/SignInWithGoogle";
import SignInWithKeycloak from "@/components/SignInWithKeycloak";
import styles from "./AlternativeSignIns.module.less";
import { makeClassName } from "@/utils/tsxUtils";

export function AlternativeSignIns( props: Readonly<AlternativeSignIns.Props> ) {
    const { environment, topDivider, bottomDivider, className, ...divAttrs } = props;

    const enabledGoogle = environment?.login_google_enabled === true && environment.google_client_id !== undefined;
    const enabledKeycloak = environment?.keycloak_enabled === true;

    if ( !enabledGoogle && !enabledKeycloak )
        return null;

    return <div { ...divAttrs } className={ makeClassName( styles.alternative_sign_ins, className ) }>
        { topDivider && <SignInDivider { ...topDivider } /> }

        { enabledGoogle && <SignInWithGoogle
            client_id={ environment.google_client_id! }
            text={ environment.google_login_text }
            imageUrl={ environment.google_login_image_url }
        /> }

        { enabledKeycloak && <SignInWithKeycloak
            imageUrl={ environment.keycloak_login_image_url }
            text={ environment.keycloak_login_text }
        /> }

        { bottomDivider && <SignInDivider { ...bottomDivider } /> }
    </div>;
}

export function SignInDivider( props: Readonly<AlternativeSignIns.DividerProps> ) {
    const { text, color = "var(--font-color-v2)", className, style, ...divAttrs } = props;
    const backgroundColor = color;

    return <div {...divAttrs} className={ makeClassName( styles.divider_container, className ) } style={ { ...style, color } }>
        <div className={ styles.line } style={ { backgroundColor } }/>
        <div className={ styles.text } style={ { color } }>{ text }</div>
        <div className={ styles.line } style={ { backgroundColor } }/>
    </div>
}
