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

            <SettingsMoveTo title="Competências" description="Configurar e validar competências cadastradas na plataforma" to="competences" />
            <SettingsMoveTo title="Departamentos" description="Configurar departamentos cadastrados na plataforma" to="departments" />
        </> }
    </div>
}
