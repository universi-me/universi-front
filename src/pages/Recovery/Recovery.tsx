import { Header } from "@/components/UniversiHeader"
import "./Recovery.css"
import { transform } from "@babel/core"
import { Translate } from "phosphor-react"
import "../singin/signinForm.css"
import {useState} from "react"
import UniversimeApi from "@/services/UniversimeApi"


export default function Recovery(){

    const [username, setUsername] = useState("")
    const [msg, setMsg] = useState<null | string>(null)

    function handleRecover(){
        UniversimeApi.User.recoverPassword({username})
        .then(res =>{
            if(res.success)
                setMsg(res.message ?? "Houve um erro")
        })
    }


    return(
        <div>
            <h2 className="center-text">Recuperação de senha</h2>
            <div className="center-container">
                {
                    msg === null ? <></> : <h2>{msg}</h2>
                }
                <div className="container form-container">
                    <div className="form-group">
                        <div className="label-form">
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Insira seu usuario ou e-mail"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        value="Entrar"
                        className="btn_form"
                        onClick={handleRecover}
                    >
                        ENVIAR
                    </button>

                </div>
            </div>
        </div>

    )

}