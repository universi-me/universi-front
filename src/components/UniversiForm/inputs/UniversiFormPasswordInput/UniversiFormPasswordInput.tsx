import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";

import MaterialIcon from "@/components/MaterialIcon";
import { PasswordValidity } from "@/utils/passwordValidation";

import { UniversiFormContext } from "../../UniversiFormContext";
import { FieldHelp, RequiredIndicator, useInitialize } from "../../utils";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormPasswordInput.module.less";


const UniversiFormPasswordInputContext = createContext<Optional<UniversiFormPasswordInputContextType>>( undefined );

export function UniversiFormPasswordInput( props: Readonly<UniversiFormPasswordInputProps> ) {
    const context = useContext( UniversiFormContext );

    const [ password, setPassword ] = useState<string>( "" );
    const [ confirm, setConfirm ] = useState<Optional<string>>( props.mustConfirm ? password : undefined );
    const [ forceVisible, setForceVisible ] = useState<boolean>( false );


    useInitialize( { props, value: password } );

    const valid = useMemo( () => new PasswordValidity( password, confirm ), [] );
    const passwordContextValue = useMemo<UniversiFormPasswordInputContextType>( () => ({ ...props, valid }), [] );

    useEffect( () => {
        setConfirm( props.mustConfirm ? "" : undefined );
    }, [ props.mustConfirm ] );

    function generateSecurePassword(length = 12) {
        if (length < 8) length = 8;
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const specials = "!@#$%^&*()_+";
        const allChars = lower + upper + numbers + specials;
        let newPassword =
            lower[Math.floor(Math.random() * lower.length)] +
            upper[Math.floor(Math.random() * upper.length)] +
            (Math.random() < 0.5
                ? numbers[Math.floor(Math.random() * numbers.length)]
                : specials[Math.floor(Math.random() * specials.length)]);
        while (newPassword.length < length) {
            newPassword += allChars[Math.floor(Math.random() * allChars.length)];
        }
        newPassword = newPassword
            .split("")
            .sort(() => 0.5 - Math.random())
            .join("");
        return newPassword;
    }

    function actionGeneratePassword() {
        let newPassword = generateSecurePassword()
        update(newPassword, newPassword);
        setForceVisible( true );
    }

    function didToggleVisibility() {
        setForceVisible( false );
    }

    return <UniversiFormPasswordInputContext.Provider value={ passwordContextValue }>
        <fieldset className={ formStyles.fieldset }>
            <legend>{ props.label } <RequiredIndicator required={props.required} /></legend>
            <PasswordField
                generateAction={ actionGeneratePassword }
                needVisibilityPassword={ forceVisible }
                didToggleVisibility={ v => didToggleVisibility() }
                onChange={ p => update( p, confirm ) }
                value={ password }
                placeholder={ props.passwordPlaceholder ?? "Insira sua senha" }
            />
            { props.mustConfirm && <PasswordField
                id={ 'confirm-' + props.param }
                needVisibilityPassword={ forceVisible }
                didToggleVisibility={ v => didToggleVisibility() }
                onChange={ c => update( password, c ) }
                value={ confirm }
                placeholder={ props.confirmPlaceholder ?? "Confirme sua senha" }
            /> }
            <FieldHelp>{ props.help }</FieldHelp>

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

    allowClear?: boolean;
    allowCopy?: boolean;
    allowGenerate?: boolean;

    passwordPlaceholder?: string;
    confirmPlaceholder?: string;
};

type UniversiFormPasswordInputContextType = UniversiFormPasswordInputProps & {
    valid: PasswordValidity;
};

function PasswordField( props: Readonly<PasswordFieldProps> ) {
    const [ visible, setVisible ] = useState<boolean>( false );
    const context = useContext( UniversiFormPasswordInputContext );
    const refInput = useRef<HTMLInputElement>({} as HTMLInputElement | null);

    if ( context === undefined ) return null;

    function toggleVisibility() {
        setVisible( v => !(v || props.needVisibilityPassword) );
        props.didToggleVisibility?.( visible );
    }

    function copyToClipboard() {
        if ( !props.value ) return;
        navigator.clipboard.writeText( props.value )
        refInput?.current?.select();
    }

    function clearValue() {
        props.onChange?.( "" );
    }

    return <div className={ styles.input_wrapper }>
        <MaterialIcon icon="lock" className={ styles.lock_icon } />
        <input
            ref={ refInput }
            type={ (visible || props.needVisibilityPassword) ? "text" : "password" }
            name={ context.param }
            id={ props.id ?? context.param }
            required={ context.required }
            onChange={ e => props.onChange( e.currentTarget.value ) }
            value={ props.value }
            placeholder={ props.placeholder }
        />
        <div className={styles.buttons}>
            {
                context.allowClear && props.value &&
                <button type="button" onClick={clearValue} className={ styles.buttons_button } disabled={ !props.value } title="Limpar">
                    <i className="bi bi-x-lg" style={{fontSize: "1.5em" }} />
                </button>
            }
            {   context.allowGenerate && props.generateAction &&
                <button type="button" onClick={ () => { props.generateAction?.(); } } className={ styles.buttons_button } title="Gerar senha">
                    <i className="bi bi-arrow-repeat" style={{fontSize: "1.5em" }}/>
                </button>
            }
            {
                context.allowCopy &&
                <button type="button" onClick={copyToClipboard} className={ styles.buttons_button } disabled={ !props.value } title="Copiar senha">
                    <i className="bi bi-clipboard" style={{fontSize: "1.5em" }} />
                </button>
            }
            <button type="button" onClick={ e => toggleVisibility() } className={ styles.buttons_button }>
                <MaterialIcon icon={ (visible || props.needVisibilityPassword) ? "visibility" : "visibility_off" } />
            </button>
        </div>
    </div>
}

type PasswordFieldProps = {
    id?: string;
    onChange( value: string ): any;
    value?: string;
    placeholder?: string;
    generateAction?: () => any;
    needVisibilityPassword?: boolean;
    didToggleVisibility?: ( visible: boolean ) => any;
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
