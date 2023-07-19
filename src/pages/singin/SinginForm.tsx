import { useContext, useState } from "react";
import "./signinForm.css";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { redirect, useNavigate } from "react-router-dom";
import { oauthSignIn } from "../../services/oauth2-google";
import Modal from "./modal/Modal";

export default function SinginForm() {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(Boolean);

  const handleAuthLoginGoogle = async () => {
    window.location.href = oauthSignIn().toString();
  };

  const handleLogin = async () => {
    if (email && password) {
      const isLogged = await auth.signin(email, password);
      if (isLogged) {
        navigate("/profile");
      }
      else {
        setIsOpen(true)
        setTimeout(()=>{
          setIsOpen(false)
        },3000)
       
      }
    }
  };

  const isButtonDisable = email.length && password.length > 0 ? false : true;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
  <>
  
  <div className="container">
  <Modal isOpen={isOpen}/>
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
      </form>

      <button
        type="submit"
        value="Entrar"
        className="btn_form"
        disabled={isButtonDisable}
        onClick={handleLogin}
      >
        ENTRAR
      </button>

      <div className="container-line">
        <div className="line"></div>
        <p>ou entre com</p>
        <div className="line"></div>
      </div>

      <button
        className="btn_form_dcx"
        type="button"
        onClick={handleAuthLoginGoogle}
      >
        <img src="../../../public/assets/imgs/dcx-png 1.png" />
        EMAIL DCX
      </button>
    </div>
  </>
  
  );
}
