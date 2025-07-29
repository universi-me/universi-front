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

            <SettingsMoveTo title="Variáveis Ambiente" description="Configurar as variáveis ambiente da plataforma" to="environments" />
            <SettingsMoveTo title="Usuários" description="Gerenciar os usuários da plataforma" to="roles" />
            <SettingsMoveTo title="Emails" description="Configurar emails que podem ser cadastrados no Universi.me" to="email-filter" />
            <SettingsMoveTo title="Entidades" description="Configurar as entidades cadastradas na plataforma" to="entities" />
            <SettingsMoveTo title="Tema de cores" description="Configurar tema de cores da plataforma" to="theme-color"/>
            {/* <SettingsMoveTo title="Analytics" description="Ver detalhes do monitoramento com Google Analytics" to="#"/> */}
        </> }

            <div id="build-version">
                <i>Versão do Universi.me</i><br/>
                <i>Web: { import.meta.env.VITE_BUILD_HASH ?? '---' }</i><br/>
                <i>API: { auth.organization.buildHash ?? '---' }</i>
            </div>
        </div>
    </div>
}
