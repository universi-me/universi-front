import { useContext, useEffect, useReducer, useState } from "react";
import _ from "lodash";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import UniversimeApi from "@/services/UniversimeApi";
import type { GroupTheme } from "@/types/Group";
import { AuthContext } from "@/contexts/Auth/AuthContext";
import { useTheme } from "@/pages/Settings/GroupThemeColorPage/ThemeContext";
import { applyThemeStyles } from "@/utils/themeUtils";
import { themeColorMappings } from "./ThemeMappings";
import ThemeColorItem from "./ThemeColorItem";
import "./GroupThemeColor.less";

function themeReducer(
  state: GroupTheme | null,
  action: { type: "SELECT"; theme: GroupTheme }
) {
    if (action.type === "SELECT") {
        applyThemeStyles(action.theme);
        return action.theme;
    }

    return state;
}

const showErrorModal = (title: string, text: string) => {
  SwalUtils.fireModal({
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: "OK",
  });
};

export function GroupThemeColorPage() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [selectedTheme, themeDispatch] = useReducer(themeReducer, null);
  const auth = useContext(AuthContext);
  const theme = useTheme();

  const saveChanges = async () => {
    if (!selectedTheme || !organizationId) {
      showErrorModal(
        "Erro ao salvar alterações",
        "Ocorreu um erro ao salvar as alterações do tema. Por favor, tente novamente.)"
      );
      return;
    }

    try {
      await UniversimeApi.Group.editTheme({
        groupId: organizationId,
        ...selectedTheme,
      });
      applyThemeStyles(selectedTheme);
    } catch {
      showErrorModal(
        "Erro ao salvar alterações",
        "Ocorreu um erro ao salvar as alterações do tema. Por favor, tente novamente."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const organizationTheme = auth.organization.groupSettings.theme;
        // ((auth.organization ?? ({} as any)).groupSettings ?? ({} as any))
        //   .theme ?? ({} as any);

    if (organizationTheme) {
        themeDispatch({ type: "SELECT", theme: organizationTheme });
        setOrganizationId(auth.organization?.id!);
        applyThemeStyles(organizationTheme);
      }
    };
    fetchData();
  }, [auth.organization]);

  useEffect(() => {
    return () => {
        applyThemeStyles(auth.organization.groupSettings.theme);
    };
  }, []);

  return (
    <div id="theme-color-settings">
      <SettingsTitle>Configuração de Tema</SettingsTitle>
      <SettingsDescription>Escolha o tema para o grupo.</SettingsDescription>

      <div className="theme-color-list">
        {Object.keys(themeColorMappings).map((themeName) => {
            const theme = themeColorMappings[themeName]

            return <ThemeColorItem
              key={themeName}
              theme={theme}
              isSelected={ _.isEqual(theme, selectedTheme) }
              onClick={(selected) =>
                themeDispatch({ type: "SELECT", theme: selected })
              }
            />
        })}
      </div>

      <div className="save-button">
        <div className="spacer" />
        <ActionButton name="Salvar" buttonProps={{ onClick: saveChanges }} />
      </div>
    </div>
  );
}
