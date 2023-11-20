import { useContext } from "react";
import { useOutlet } from "react-router";
import { Navigate } from "react-router-dom";

import { SettingsTitle, SettingsMoveTo } from "@/pages/Settings";
import { AuthContext } from "@/contexts/Auth";

import "./Settings.less";

export function SettingsPage() {
    const outlet = useOutlet();
    const auth = useContext(AuthContext);

    if (auth.profile?.user.accessLevel !== "ROLE_ADMIN")
        return <Navigate to="/" />;

    return <div id="universi-settings">
        <div id="settings-content">
        { outlet ?? <>
            <SettingsTitle>Configurações</SettingsTitle>

            <SettingsMoveTo title="Administradores" description="Gerenciar administradores da plataforma" to="#" />
            <SettingsMoveTo title="Emails" description="Configurar emails que podem ser cadastrados no Universi.me" to="#" />
            <SettingsMoveTo title="Tema de cores" description="Configurar tema de cores da plataforma" to="#"/>
            <SettingsMoveTo title="Analytics" description="Ver detalhes do monitoramento com Google Analytics" to="#"/>
        </> }
        </div>
    </div>
}
