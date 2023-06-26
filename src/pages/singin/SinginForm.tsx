import { useContext, useState } from "react";
import "./signinForm.css";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import firebase from "../../services/firebase";

export default function SinginForm() {
  
  const auth = useContext(AuthContext)

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleAuthLoginGoogle = async () => {
    auth.signout()
    const provider = new firebase.auth.GoogleAuthProvider();
    
    provider.setCustomParameters({ hd: 'dcx.ufpb.br' });

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        console.log(result)
        if(result.user?.email?.endsWith("@dcx.ufpb.br")){
          const isLogged  = await auth.signin(result.user.email, "")
          console.log(isLogged);
          
          if(isLogged) {
            navigate("/profile");
          }
        }
        else {
          firebase.auth().signOut().then(() => {
            console.log('Usuário não autorizado. Faça login com um e-mail válido.');
          });
        }
        
      })
      .catch((error) => {
        console.error(error);
      });
    
  }

  const handleLogin = async () => {
    auth.signout()
    if(email && password) {
      const isLogged = await auth.signin(email, password);
      if(isLogged) {
        navigate("/profile");
      }
    }
  }

  const isButtonDisable = email.length && password.length > 0 ? false : true;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
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

      <button className="btn_form_dcx" type="submit" onClick={handleAuthLoginGoogle}>
        <img src="../../../public/assets/imgs/dcx-png 1.png" />
        EMAIL DCX
      </button>
    </div>
  );
}
