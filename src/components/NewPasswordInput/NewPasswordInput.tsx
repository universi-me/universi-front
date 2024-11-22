import { useEffect, useState } from "react"
import { minimumLength, numberOrSpecialChar, passwordValidationClass, upperAndLowerCase, equality } from "@/utils/passwordValidation";
import { NullableBoolean } from "@/types/utils";

import './NewPasswordInput.less';

interface NewPasswordInputProps {
    password: string;
    setPassword: (password: string) => void;
    valid: NullableBoolean;
    setValid: (valid: NullableBoolean) => void;
}

const NewPasswordInput: React.FC<NewPasswordInputProps> = ({ password, setPassword, valid, setValid }) => {

    const [passwordRepeat, setPasswordRepeat] = useState<string>("")

    const [validPasswordEquality, setValidPasswordEquality] = useState<NullableBoolean>(false);
    const [validPasswordLength, setValidPasswordLength] = useState<NullableBoolean>(false);
    const [validPasswordCase, setValidPasswordCase] = useState<NullableBoolean>(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = useState<NullableBoolean>(false);

    useEffect(() => {

        setValidPasswordLength(minimumLength(password));
        setValidPasswordCase(upperAndLowerCase(password));
        setValidPasswordSpecial(numberOrSpecialChar(password));
        setValidPasswordEquality(equality(password, passwordRepeat));

        let isOk = minimumLength(password) &&
                   upperAndLowerCase(password) &&
                   numberOrSpecialChar(password) &&
                   equality(password, passwordRepeat);

        setValid(isOk);

    }, [password, passwordRepeat]);


    return (
        <div className="password-input">
          <PasswordInputGroup
            password={ password }
            onChange={ setPassword }
            placeholder="Insira sua senha" 
            inputName="password"
        />
        <br/>
        <PasswordInputGroup
            password={ passwordRepeat }
            onChange={ setPasswordRepeat }
            placeholder="Confirme sua nova senha"
            inputName="newPassword"
        />

        <br/>
          <div className="password-requirements">
            <h3>Sua senha precisa conter:</h3>
            <p className={`bi min-length ${passwordValidationClass(validPasswordLength)}`}>
              Tamanho mínimo de oito caracteres
            </p>
            <p className={`bi upper-lower-case ${passwordValidationClass(validPasswordCase)}`}>
              Letras minúsculas e maiúsculas
            </p>
            <p className={`bi number-special-char ${passwordValidationClass(validPasswordSpecial)}`}>
              Números ou caracteres especiais
            </p>
            <p className={`bi password-equality ${passwordValidationClass(validPasswordEquality)}`}>
              Confirme a sua nova senha
            </p>
          </div>
          <br/>
        </div>
      );
}

function PasswordInputGroup( props: Readonly<PasswordInputGroupProps> ) {
    const { password, placeholder, inputName, onChange } = props;
    const [ showPassword, setShowPassword ] = useState( false );

    return <div className="form-group">
        <span className="label-form material-symbols-outlined">lock</span>
        <input
            type={showPassword ? "text" : "password"}
            id={ inputName }
            name={ inputName }
            value={ password }
            onChange={ e => onChange( e.target.value ) }
            placeholder={ placeholder }
            required
        />
        <span className="toggle" onClick={ e => setShowPassword( s => !s ) }>
        <span className="material-symbols-outlined">
            { showPassword ? "visibility" : "visibility_off" }
        </span>
        </span>
    </div>
}

type PasswordInputGroupProps = {
    password: string;
    placeholder: string;
    inputName?: string;
    onChange( password: string ): unknown;
}

export default NewPasswordInput;
