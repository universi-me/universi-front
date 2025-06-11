import { useContext } from "react";

import TextboxFormatted from "@/components/TextboxFormatted";

import { FieldHelp, RequiredIndicator, useInitialize } from "../../utils";
import { UniversiFormContext } from "../../UniversiFormContext";

import styles from "./UniversiFormFormattedTextInput.module.less";
import formStyles from "../../UniversiForm.module.less";


export function UniversiFormFormattedTextInput( props: Readonly<UniversiFormFormattedTextInputProps> ) {
    const context = useContext( UniversiFormContext );
    useInitialize( { props, value: props.defaultValue } );

    return <fieldset className={ formStyles.fieldset }>
        <legend>{ props.label } <RequiredIndicator required={ props.required } /></legend>
        <TextboxFormatted
            value={ props.defaultValue }
            className={ styles.input }
            onChange={ handleChange }
            placeholder={ props.placeholder }
        />
        <FieldHelp>{ props.help }</FieldHelp>
    </fieldset>

    async function handleChange( value: string ) {
        value = validateHtml( value );
        await context?.set( props.param, value );
        props.onChange?.( value );
    }

    function validateHtml( value: string ): string {
        if (value.trim() === "") return "";

        const validValueArray: string[] = [];

        value.replace(HTML_REGEX, (match, openTag, content, closeTag) => {
            content = content.trim();

            if ( content !== "" && content !== "<br>" ) {
                validValueArray.push(openTag + content + closeTag); // Preserve original <p> tag
            }

            return match;
        });

        return validValueArray.join("");
    }
}
const HTML_REGEX = /(<p[^>]*>)([\s\S]*?)(<\/p>)/g;

export type UniversiFormFormattedTextInputProps = UniversiFormFieldProps<string> & {
    placeholder?: string;
};
