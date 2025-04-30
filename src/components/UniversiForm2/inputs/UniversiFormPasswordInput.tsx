import { createContext, useContext, useEffect, useRef, useState } from "react";

import MaterialIcon from "@/components/MaterialIcon";
import { passwordValidationClass, PasswordValidity } from "@/utils/passwordValidation";

import { UniversiFormContext } from "../UniversiFormContext";


const UniversiFormPasswordInputContext = createContext<Optional<UniversiFormPasswordInputProps>>( undefined );

export function UniversiFormPasswordInput( props: Readonly<UniversiFormPasswordInputProps> ) {
    const context = useContext( UniversiFormContext );

    const [ password, setPassword ] = useState<string>( "" );
    const [ confirm, setConfirm ] = useState<Optional<string>>( props.mustConfirm ? password : undefined );
    useEffect( () => {
        setConfirm( props.mustConfirm ? "" : undefined );
    }, [ props.mustConfirm ] );

    const isValid = useRef<boolean>( true );

    return <UniversiFormPasswordInputContext.Provider value={{ ...props, onCheckValidity }}>
        <fieldset className="universi-form-field">
            <legend>{ props.label }</legend>
            <PasswordField
                onChange={ onChangePassword }
                placeholder={ props.passwordPlaceholder ?? "Insira sua senha" }
            />
            { props.mustConfirm && <PasswordField
                onChange={ setConfirm }
                placeholder={ props.confirmPlaceholder ?? "Confirme sua senha" }
            /> }

            { props.mustMatchRequirements && <PasswordRequirements
                password={password}
                confirm={confirm}
            /> }
        </fieldset>
    </UniversiFormPasswordInputContext.Provider>;

    function onChangePassword( passwordInput: string ) {
        let contextValue = passwordInput;

        if ( props.mustMatchRequirements && !isValid.current )
            contextValue = "";

        if ( props.mustConfirm && password !== confirm )
            contextValue = "";

        context?.set( props.param, contextValue );
        setPassword( passwordInput );
        props.onChange?.( passwordInput );
    }

    function onCheckValidity( validity: PasswordValidity ) {
        isValid.current = validity.allValid;

        props.onCheckValidity?.( validity );
    }
}

export type UniversiFormPasswordInputProps = Omit<UniversiFormFieldProps<string>, "defaultValue"> & {
    mustConfirm?: boolean;
    mustMatchRequirements?: boolean;
    onCheckValidity?( validity: PasswordValidity ): any;

    passwordPlaceholder?: string;
    confirmPlaceholder?: string;
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

export function PasswordRequirements( props: Readonly<PasswordRequirementsProps> ) {
    const context = useContext( UniversiFormPasswordInputContext );

    const valid = new PasswordValidity( props.password, props.confirm );
    useEffect( () => {
        valid.password = props.password;
        valid.passwordRepeat = props.confirm;

        context?.onCheckValidity?.( valid );
    }, [ props.password, props.confirm ] );

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

export type PasswordRequirementsProps = {
    password: string;
    confirm?: string;
};
