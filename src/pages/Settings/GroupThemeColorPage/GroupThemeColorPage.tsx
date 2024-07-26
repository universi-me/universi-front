import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import UniversimeApi from "@/services/UniversimeApi";
import type { GroupTheme } from "@/types/Group";
import { AuthContext } from "@/contexts/Auth/AuthContext";
import ThemeContext from "@/contexts/Theme";
import { themeColorMappings } from "./ThemeMappings";
import ThemeColorItem from "./ThemeColorItem";
import "./GroupThemeColor.less";


export function GroupThemeColorPage() {
    const auth = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const [selectedTheme, setSelectedTheme] = useState<GroupTheme>(auth.organization.groupSettings.theme);

    useEffect(() => {
        // Applies organization theme on exit page
        return () => {
            themeContext.changeTheme(auth.organization.groupSettings.theme);
        };
    }, []);

  return (
    <div id="theme-color-settings">
      <SettingsTitle>Configuração de Tema</SettingsTitle>
      <SettingsDescription>Escolha o tema para o grupo.</SettingsDescription>

      <div id="theme-color-list">
        {Object.keys(themeColorMappings).map((themeName) => {
            const theme = themeColorMappings[themeName]

            return <ThemeColorItem
              key={themeName}
              theme={theme}
              isSelected={ _.isEqual(theme, selectedTheme) }
              onClick={ changeTheme }
            />
        })}
      </div>

      <div id="save-button">
        <div id="spacer" />
        <ActionButton name="Salvar" buttonProps={{ onClick: saveChanges, }}/>
      </div>
    </div>
  );

    function changeTheme(theme: GroupTheme) {
        setSelectedTheme(theme);
        themeContext.changeTheme(theme);
    }

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
            themeContext.changeTheme(selectedTheme);
        }
    }
}
