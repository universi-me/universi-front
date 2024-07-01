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

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

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

    function toggleShowPassword(){
        setShowPassword(!showPassword)
    }

    function toggleShowPasswordRepeat(){
        setShowPasswordRepeat(!showPasswordRepeat)
    }

    return (
        <div className="password-input">
          <div className="form-group">
            <div className="label-form">
              <span className="material-symbols-outlined">lock</span>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Insira sua nova senha"
              required
            />
            <span className="toggle" onClick={toggleShowPassword}>
              <span className="material-symbols-outlined">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </span>
          </div>
          <br/>
            <div className="form-group">
                <div className="label-form">
                <span className="material-symbols-outlined">lock</span>
                </div>
                <input
                type={showPasswordRepeat ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                placeholder="Confirme sua nova senha"
                required
                />
                <span className="toggle" onClick={toggleShowPasswordRepeat}>
                <span className="material-symbols-outlined">
                    {showPasswordRepeat ? "visibility" : "visibility_off"}
                </span>
                </span>
            </div>

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

export default NewPasswordInput;