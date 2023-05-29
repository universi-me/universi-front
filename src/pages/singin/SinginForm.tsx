import "./signinForm.css";

export default function SinginForm() {
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
            placeholder="Insira seu usuario ou e-mail"
            required
          />
        </div>

        <div className="form-group">
          <div className="label-form">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <input type="password" id="password" name="password" placeholder="Senha" required />
        </div>
      </form>

      <button type="submit" value="Entrar" className="btn_form">
        ENTRAR
      </button>

      <div className="container-line">
        <div className="line"></div>
        <p>ou entre com</p>
        <div className="line"></div>
      </div>

      <button className="btn_form_dcx" onClick={()=> {alert(1)}}>
        <img src="../../../public/assets/imgs/dcx-png 1.png"  />
          EMAIL DCX
      </button>
    </div>
  );
}
