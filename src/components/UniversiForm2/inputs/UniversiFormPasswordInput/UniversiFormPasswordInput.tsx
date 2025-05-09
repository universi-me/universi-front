import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import MaterialIcon from "@/components/MaterialIcon";
import { PasswordValidity } from "@/utils/passwordValidation";

import { UniversiFormContext } from "../../UniversiFormContext";
import { RequiredIndicator } from "../../utils";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormPasswordInput.module.less";


const UniversiFormPasswordInputContext = createContext<Optional<UniversiFormPasswordInputContextType>>( undefined );

export function UniversiFormPasswordInput( props: Readonly<UniversiFormPasswordInputProps> ) {
    const context = useContext( UniversiFormContext );

    const [ password, setPassword ] = useState<string>( "" );
    const [ confirm, setConfirm ] = useState<Optional<string>>( props.mustConfirm ? password : undefined );

    useEffect(
        () => context?.initialize( props.param, password, { functions: props.validations, required: props.required } ),
        [ props.required, props.validations ]
    );

    const valid = useMemo( () => new PasswordValidity( password, confirm ), [] );
    const passwordContextValue = useMemo<UniversiFormPasswordInputContextType>( () => ({ ...props, valid }), [] );

    useEffect( () => {
        setConfirm( props.mustConfirm ? "" : undefined );
    }, [ props.mustConfirm ] );

    return <UniversiFormPasswordInputContext.Provider value={ passwordContextValue }>
        <fieldset className={ formStyles.fieldset }>
            <legend>{ props.label } <RequiredIndicator required={props.required} /></legend>
            <PasswordField
                onChange={ p => update( p, confirm ) }
                placeholder={ props.passwordPlaceholder ?? "Insira sua senha" }
            />
            { props.mustConfirm && <PasswordField
                onChange={ c => update( password, c ) }
                placeholder={ props.confirmPlaceholder ?? "Confirme sua senha" }
            /> }

            { props.mustMatchRequirements && <div className={ styles.requirements_wrapper }>
                <h3>Sua senha precisa conter:</h3>
                <ValidationText value={ valid.length }>Tamanho mínimo de oito caracteres</ValidationText>
                <ValidationText value={ valid.case }>Letras minúsculas e maiúsculas</ValidationText>
                <ValidationText value={ valid.special }>Números ou caracteres especiais</ValidationText>

                { valid.confirm !== undefined && <ValidationText value={ valid.confirm }>Confirme a senha</ValidationText> }
            </div> }
        </fieldset>
    </UniversiFormPasswordInputContext.Provider>;

    async function update( password: string, confirm?: string ) {
        let contextValue = password;
        valid.password = password;
        valid.passwordRepeat = confirm;

        if ( props.mustMatchRequirements && !valid.allValid )
            contextValue = "";

        if ( props.mustConfirm && password !== confirm )
            contextValue = "";

        await context?.set( props.param, contextValue );
        props.onCheckValidity?.( valid );

        setPassword( old => {
            if ( old !== password ) props.onChange?.( password );
            return password;
        } );
        setConfirm( confirm );
    }
}

export type UniversiFormPasswordInputProps = Omit<UniversiFormFieldProps<string>, "defaultValue"> & {
    mustConfirm?: boolean;
    mustMatchRequirements?: boolean;
    onCheckValidity?( validity: PasswordValidity ): any;

    passwordPlaceholder?: string;
    confirmPlaceholder?: string;
};

type UniversiFormPasswordInputContextType = UniversiFormPasswordInputProps & {
    valid: PasswordValidity;
};

function PasswordField( props: Readonly<PasswordFieldProps> ) {
    const [ visible, setVisible ] = useState<boolean>( false );
    const context = useContext( UniversiFormPasswordInputContext );

    if ( context === undefined ) return null;

    return <div className={ styles.input_wrapper }>
        <MaterialIcon icon="lock" className={ styles.lock_icon } />
        <input
            type={ visible ? "text" : "password" }
            name={ context.param }
            id={ context.param }
            required={ context.required }
            onChange={ e => props.onChange( e.currentTarget.value ) }
            placeholder={ props.placeholder }
        />
        <button type="button" onClick={ e => setVisible( v => !v ) } className={ styles.toggle_visibility }>
            <MaterialIcon icon={ visible ? "visibility" : "visibility_off" } />
        </button>
    </div>
}

type PasswordFieldProps = {
    onChange( value: string ): any;
    placeholder?: string;
};

function ValidationText( props: Readonly<ValidationIconProps> ) {
    const { iconClass, textClass } = useMemo( () => ({
        iconClass: props.value === null
            ? "bi bi-circle"
            : props.value
                ? "bi bi-check-circle-fill"
                : "bi bi-x-circle-fill",

        textClass: props.value === null
            ? ""
            : props.value
                ? styles.valid_requirement
                : styles.invalid_requirement
    }), [ props.value ] )

    return <p className={ textClass }>
        <span className={ iconClass } /> { props.children }
    </p>
}

type ValidationIconProps = {
    value: Nullable<boolean>;
    children: NonNullable<ReactNode>;
};
