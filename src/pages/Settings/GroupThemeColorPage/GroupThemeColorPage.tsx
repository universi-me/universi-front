import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import UniversimeApi from "@/services/UniversimeApi";
import type { GroupTheme } from "@/types/Group";
import { AuthContext } from "@/contexts/Auth/AuthContext";
import ThemeContext from "@/contexts/Theme";
import ThemeMappings from "@/configs/ThemeMappings";
import ThemeColorItem from "./ThemeColorItem";
import ThemeBuilder from "@/components/ThemeBuilder";
import "./GroupThemeColor.less";
import BootstrapIcon from "@/components/BootstrapIcon";


export function GroupThemeColorPage() {
    const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const [selectedTheme, setSelectedTheme] = useState<GroupTheme>(auth.organization.groupSettings.theme ?? ThemeMappings.defaultTheme);
    const [extendedBuilder, setExtendedBuilder] = useState(false);

    useEffect(() => {
        themeContext.changeTheme(selectedTheme);
    }, [selectedTheme]);

    useEffect(() => {
        // Applies organization theme on exit page
        return () => {
            themeContext.changeTheme(auth.organization.groupSettings.theme);
        };
    }, [auth.organization.groupSettings.theme]);

    return <div id="theme-color-settings">
        <SettingsTitle>Configuração de Tema</SettingsTitle>
        <SettingsDescription>Escolha o tema para o grupo.</SettingsDescription>

        <div id="theme-color-list">
            {Object.keys(ThemeMappings).map((themeName) => {
                const theme = ThemeMappings[themeName]

                return <ThemeColorItem
                    key={themeName}
                    theme={theme}
                    isSelected={ _.isEqual(theme, selectedTheme) }
                    onClick={ setSelectedTheme }
                />
            })}
        </div>

        <section id="section-builder-wrapper">
            <button id="toggle-advanced" onClick={() => { setExtendedBuilder(eb => !eb) }}>
                <p>Configurações avançadas</p>
                <BootstrapIcon id="toggle-icon" icon="chevron-down" className={extendedBuilder ? "extended" : "collapsed"} />
            </button>

            <ThemeBuilder
                id="theme-builder"
                className={ extendedBuilder ? "extended" : "collapsed" }
                changeValue={changeThemeVariable}
                currentTheme={selectedTheme}
            />
        </section>

        <div id="save-button">
            <div id="spacer" />
            <ActionButton name="Salvar" buttonProps={{ onClick: saveChanges, }} />
        </div>
    </div>;

    async function saveChanges() {
        const res = await UniversimeApi.Group.editTheme({
            groupId: auth.organization.id,
            ...selectedTheme,
        }).catch(err => null);

        if ( !res?.success ) {
            SwalUtils.fireModal({
                title: "Erro ao salvar alterações",
                text: res?.message ?? "Ocorreu um erro ao salvar as alterações do tema. Por favor, tente novamente mais tarde. Se o problema persistir entre em contato com o suporte."
            });
        }

        else {
            await auth.updateLoggedUser();
            themeContext.changeTheme(selectedTheme);
        }
    }

    function changeThemeVariable(variable: keyof GroupTheme, value: string) {
        const newTheme = { ...selectedTheme };
        newTheme[variable] = value.toLocaleUpperCase();

        setSelectedTheme(newTheme);
    }
}
