import { useContext, type RefAttributes } from "react"
import ReCAPTCHA, { ReCAPTCHAProps } from "react-google-recaptcha-enterprise"

import { UniversiFormContext } from "../UniversiFormContext";

export function UniversiFormRecaptchaInput( props: Readonly<UniversiFormRecaptchaInputProps> ) {
    const { param, disabled, required, onChange, ...recaptchaProps } = props;
    const context = useContext( UniversiFormContext );

    return <div className="universi-form-field">
        <ReCAPTCHA {...recaptchaProps} onChange={ handleOnChange } />
    </div>;

    function handleOnChange( newToken: Nullable<string> ) {
        context?.set( param, newToken );
        props.onChange?.( newToken );
    }
}

export type UniversiFormRecaptchaInputProps = Omit<UniversiFormFieldProps<Nullable<string>>, "defaultValue" | "label">
    & Omit<ReCAPTCHAProps, "onChange">
    & RefAttributes<ReCAPTCHA>
    & {
        sitekey: string;
    };
