import { useContext } from "react";
import { AuthContext } from "@/contexts/Auth";

export function ManageProfileAccount() {
    const authContext = useContext(AuthContext);

    return (
        <section id="card-password" className="card">
            <fieldset id="fieldset-password">
                <legend>Informações da Conta</legend>
                <br/>
                <h4>Email</h4>
                <input name="email" id="email" readOnly
                    type="text" value={authContext.profile?.user.email}
                />
                <br/><br/>
                <h4>Usuário</h4>
                <input name="username" id="username" readOnly
                    type="text" value={authContext.profile?.user.name}
                />
            </fieldset>
        </section>
    );

}
