import { createContext, useContext, useEffect, useMemo, useState } from "react";

import MaterialIcon from "@/components/MaterialIcon";
import { passwordValidationClass, PasswordValidity } from "@/utils/passwordValidation";

import { UniversiFormContext } from "../UniversiFormContext";


const UniversiFormPasswordInputContext = createContext<Optional<UniversiFormPasswordInputContextType>>( undefined );

export function UniversiFormPasswordInput( props: Readonly<UniversiFormPasswordInputProps> ) {
    const context = useContext( UniversiFormContext );

    const [ password, setPassword ] = useState<string>( "" );
    const [ confirm, setConfirm ] = useState<Optional<string>>( props.mustConfirm ? password : undefined );

    const valid = useMemo( () => new PasswordValidity( password, confirm ), [] );
    const passwordContextValue = useMemo<UniversiFormPasswordInputContextType>( () => ({ ...props, valid }), [] );

    useEffect( () => {
        setConfirm( props.mustConfirm ? "" : undefined );
    }, [ props.mustConfirm ] );

    return <UniversiFormPasswordInputContext.Provider value={ passwordContextValue }>
        <fieldset className="universi-form-field">
            <legend>{ props.label }</legend>
            <PasswordField
                onChange={ p => update( p, confirm ) }
                placeholder={ props.passwordPlaceholder ?? "Insira sua senha" }
            />
            { props.mustConfirm && <PasswordField
                onChange={ c => update( password, c ) }
                placeholder={ props.confirmPlaceholder ?? "Confirme sua senha" }
            /> }

            { props.mustMatchRequirements && <PasswordRequirements /> }
        </fieldset>
    </UniversiFormPasswordInputContext.Provider>;

    function update( password: string, confirm?: string ) {
        let contextValue = password;
        valid.password = password;
        valid.passwordRepeat = confirm;

        if ( props.mustMatchRequirements && !valid.allValid )
            contextValue = "";

        if ( props.mustConfirm && password !== confirm )
            contextValue = "";

        context?.set( props.param, contextValue );
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

    return <div className="password-input-wrapper">
        <MaterialIcon icon="lock"/>
        <input
            type={ visible ? "text" : "password" }
            name={ context.param }
            id={ context.param }
            required={ context.required }
            onChange={ e => props.onChange( e.currentTarget.value ) }
            placeholder={ props.placeholder }
        />
        <button type="button" onClick={ e => setVisible( v => !v ) }>
            <MaterialIcon icon={ visible ? "visibility" : "visibility_off" } />
        </button>
    </div>
}

type PasswordFieldProps = {
    onChange( value: string ): any;
    placeholder?: string;
};

export function PasswordRequirements() {
    const { valid } = useContext( UniversiFormPasswordInputContext )!;

    return <div className="password-requirements">
        <h3>Sua senha precisa conter:</h3>
        <p className={ `bi min-length ${passwordValidationClass( valid.length )}` }>
            Tamanho mínimo de oito caracteres
        </p>
        <p className={`bi upper-lower-case ${passwordValidationClass( valid.case )}`}>
            Letras minúsculas e maiúsculas
        </p>
        <p className={`bi number-special-char ${passwordValidationClass( valid.special )}`}>
            Números ou caracteres especiais
        </p>
        { valid.confirm !== undefined && <p className={`bi password-equality ${passwordValidationClass( valid.confirm )}`}>
            Confirme a senha
        </p> }
    </div>
}
