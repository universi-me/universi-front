import { useContext, type RefAttributes } from "react"
import ReCAPTCHA, { ReCAPTCHAProps } from "react-google-recaptcha-enterprise"

import { makeClassName } from "@/utils/tsxUtils";
import { UniversiFormContext } from "../../UniversiFormContext";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormRecaptchaInput.module.less";
import { useInitialize } from "../../utils";


export function UniversiFormRecaptchaInput( props: Readonly<UniversiFormRecaptchaInputProps> ) {
    const { param, disabled, required, validations, onChange, ...recaptchaProps } = props;
    const context = useContext( UniversiFormContext );
    useInitialize( { props, value: null } );

    return <fieldset className={ makeClassName( formStyles.fieldset, styles.fieldset ) }>
        <ReCAPTCHA {...recaptchaProps} onChange={ handleOnChange } />
    </fieldset>;

    async function handleOnChange( newToken: Nullable<string> ) {
        await context?.set( param, newToken );
        props.onChange?.( newToken );
    }
}

export type UniversiFormRecaptchaInputProps = Omit<UniversiFormFieldProps<Nullable<string>>, "defaultValue" | "label">
    & Omit<ReCAPTCHAProps, "onChange">
    & RefAttributes<ReCAPTCHA>
    & {
        sitekey: string;
    };
