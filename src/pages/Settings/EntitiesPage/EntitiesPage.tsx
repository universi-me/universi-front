import { useOutlet } from "react-router";
import { SettingsDescription, SettingsMoveTo, SettingsTitle } from "@/pages/Settings";

export function EntitiesPage() {
    const outlet = useOutlet();

    return <div id="entities-settings-page">
        { outlet ?? <>
            <SettingsTitle>Entidades</SettingsTitle>
            <SettingsDescription>
                Aqui você pode listar, cadastrar, renomear ou excluir as entidades presentes no sistema.
            </SettingsDescription>

            <SettingsMoveTo title="Atividades" description="Configurar Tipos de Atividades cadastrados na plataforma" to="activities" />
            <SettingsMoveTo title="Competências" description="Configurar e validar competências cadastradas na plataforma" to="competences" />
            <SettingsMoveTo title="Grupos" description="Configurar Tipos de Grupos cadastrados na plataforma" to="groups" />
            <SettingsMoveTo title="Órgãos/Áreas" description="Configurar órgão/área cadastrados na plataforma" to="departments" />
        </> }
    </div>
}
