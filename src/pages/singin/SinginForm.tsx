import { FormEvent, useContext, useState } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha-enterprise";

import { AuthContext } from "@/contexts/Auth/AuthContext";
import { oauthSignIn } from "@/services/oauth2-google";
import { IMG_DCX_LOGO } from "@/utils/assets";

import "./signinForm.css";

export default function SinginForm() {
  const auth = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaRef, setRecaptchaRef] = useState<any>(null);


  const handleAuthLoginGoogle = async () => {
    window.location.href = oauthSignIn().toString();
  };

  const handleAuthLoginKeycloak = async () => {
    window.location.href = import.meta.env.VITE_UNIVERSIME_API + "/login/keycloak/auth";
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const logged = await auth.signin(email, password, recaptchaToken);
    recaptchaRef.reset();
  };

  const isButtonDisable = email.length && password.length > 0 ? false : true;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const organizationEnv = (((auth.organization??{} as any).groupSettings??{} as any).environment??{} as any);
  const SIGNUP_ENABLED = organizationEnv.signup_enabled ?? true;
  const ENABLE_GOOGLE_LOGIN = organizationEnv.login_google_enabled ?? (import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === "true" || import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === "1");
  const ENABLE_RECAPTCHA = organizationEnv.recaptcha_enabled ?? (import.meta.env.VITE_ENABLE_RECAPTCHA === "true" || import.meta.env.VITE_ENABLE_RECAPTCHA === "1");
  const RECAPTCHA_SITE_KEY = organizationEnv.recaptcha_site_key ?? import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  let ENABLE_KEYCLOAK_LOGIN = organizationEnv.keycloak_enabled ?? false;
  
  return (
  <>
  
  <div className="container">
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

          <span className="toggle" onClick={toggleShowPassword}>
            <span className="material-symbols-outlined">
              {showPassword == false ? "visibility" : "visibility_off"}
            </span>
          </span>
        </div>

        {
          !ENABLE_RECAPTCHA ? null :
            <center>
              <br/>
              <ReCAPTCHA ref={(r) => setRecaptchaRef(r) } sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
              <br/>
            </center>
        }

        <button
            type="submit"
            value="Entrar"
            className="btn_form"
            disabled={isButtonDisable}
            onClick={handleLogin}
        >
            ENTRAR
        </button>
      </form>


      {
        !ENABLE_GOOGLE_LOGIN ? null :
        <>
            <div className="container-line-form" style={{margin: "20px 0"}}>
                <div className="line-form"></div>
                <div style={{color: "#c2c2c2"}}>ou entre com</div>
                <div className="line-form"></div>
            </div>

            <button
                className="btn_form_dcx"
                type="button"
                onClick={handleAuthLoginGoogle}
            >
                <img src={IMG_DCX_LOGO} />
                EMAIL DCX
            </button>
        </>
      }

      {
        !ENABLE_KEYCLOAK_LOGIN ? null :
        <>
            <div className="container-line-form" style={{margin: "20px 0"}}>
                <div className="line-form"></div>
                <div style={{color: "#c2c2c2"}}>ou entre com</div>
                <div className="line-form"></div>
            </div>

            <button
                className="btn_form_dcx"
                type="button"
                onClick={handleAuthLoginKeycloak}
            >
                <img src="https://i.imgur.com/pKFFuoh.png"  height={70}/>
                Keycloak
            </button>
        </>
      }

      { !SIGNUP_ENABLED ? null :
        <div className="container-line-form" style={{marginTop: "20px"}}>
            <Link to="/signup">Crie sua conta</Link>
        </div>
      }
        <div className="container-line-form" style={{marginTop: "20px"}}>
            <Link to="/recovery">Esqueci minha senha</Link>
        </div>
    </div>
  </>
  
  );
}
