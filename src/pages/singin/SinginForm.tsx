import { FormEvent, useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha-enterprise";

import { AuthContext } from "@/contexts/Auth/AuthContext";
import AlternativeSignIns from "@/components/AlternativeSignIns";

import "./SignInForm.less";

export default function SinginForm() {
  const auth = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>( null );

  const organizationEnv = auth.organization.groupSettings.environment;
  const SIGNUP_ENABLED = organizationEnv?.signup_enabled ?? true;
  const RECOVERY_ENABLED = organizationEnv?.recovery_enabled ?? true;
  const ENABLE_RECAPTCHA = organizationEnv?.recaptcha_enabled ?? (import.meta.env.VITE_ENABLE_RECAPTCHA === "true" || import.meta.env.VITE_ENABLE_RECAPTCHA === "1");
  const RECAPTCHA_SITE_KEY = organizationEnv?.recaptcha_site_key ?? import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const disableSignInButton = !email.length || !password.length || ( ENABLE_RECAPTCHA && !recaptchaToken );

  return <div id="signin-form-container">
      <form action="/login" method="post" className="form-container">
        <div className="form-group">
          <div className="label-form">
            <span className="material-symbols-outlined">mail</span>
          </div>
          <input
            type="text"
            id="username"
            name="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Insira seu usuario ou e-mail"
            required
          />
        </div>

        <div className="form-group">
          <div className="label-form">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />

          <span className="toggle" onClick={ () => setShowPassword( s => !s ) }>
            <span className="material-symbols-outlined">
              {showPassword == false ? "visibility" : "visibility_off"}
            </span>
          </span>
        </div>

        {
          !ENABLE_RECAPTCHA ? null :
            <center>
              <br/>
              <ReCAPTCHA ref={ recaptchaRef } sitekey={ RECAPTCHA_SITE_KEY } onChange={ setRecaptchaToken } />
              <br/>
            </center>
        }

        <button
            type="submit"
            value="Entrar"
            className="btn_form"
            disabled={ disableSignInButton }
            onClick={handleLogin}
        >
            ENTRAR
        </button>
      </form>


      <AlternativeSignIns
        environment={ organizationEnv }
        topDivider={ { text: "ou faça login com", color: "var(--font-color-v2)" } }
        style={ { marginTop: "15px" } }
      />

      { SIGNUP_ENABLED &&
        <Link id="signup" to="/signup">Crie sua conta</Link>
      }

      { RECOVERY_ENABLED &&
        <Link id="recovery" to="/recovery">Esqueci minha senha</Link>
      }
    </div>;

    async function handleLogin( e: FormEvent ) {
        e.preventDefault();

        await auth.signin(email, password, recaptchaToken);
        recaptchaRef.current?.reset();
    }

    async function handleAuthLoginKeycloak( ) {
        window.location.href = import.meta.env.VITE_UNIVERSIME_API + "/login/keycloak/auth";
    }
}
