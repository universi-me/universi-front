import { useParams } from "react-router-dom"
import { useState } from "react"
import "./NewPassword.css"
import UniversimeApi from "@/services/UniversimeApi";

export default function NewPassword(){

    const token = location.pathname.split("/").pop()
    const [msg, setMsg] = useState<null | string>(null)
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false)

    function toggleShowPassword(){
        setShowPassword(!showPassword)
    }

    function handleNewPassword(){
        UniversimeApi.User.newPassword({password, token})
        .then(res =>{
            if(res.success)
                setMsg(res.message ?? "Houve um erro")
        })
    }

    return(
        <div>
            <h2 className="center-text">Recuperação de senha: escolha sua nova senha</h2>
            <div className="center-container">
                {
                    msg === null ? <></> : <h2>{msg}</h2>
                }
                <div className="container form-container">
                    <div className="form-group">
                        <div className="label-form">
                            <span className="material-symbols-outlined">lock</span>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="username"
                            name="newPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Insira sua nova senha"
                            required
                        />
                        <span className="toggle" onClick={toggleShowPassword}>
                            <span className="material-symbols-outlined">
                            {showPassword == false ? "visibility" : "visibility_off"}
                            </span>
                        </span>
                    </div>

                    <button
                        type="submit"
                        value="Entrar"
                        className="btn_form"
                        onClick={handleNewPassword}
                    >
                        ENVIAR
                    </button>

                </div>
            </div>
        </div>
    )


}