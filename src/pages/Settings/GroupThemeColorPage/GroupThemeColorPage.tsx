import { useContext, useEffect, useReducer, useState } from "react";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import UniversimeApi from "@/services/UniversimeApi";
import type { GroupTheme } from "@/types/Group";
import { AuthContext } from "@/contexts/Auth/AuthContext";
import { useTheme } from "@/pages/Settings/GroupThemeColorPage/ThemeContext";
import { applyThemeStyles } from "@/utils/themeUtils";
import { themeColorMappings } from "./ThemeMappings";
import "./GroupThemeColor.less";

interface ThemeColorItemProps {
  theme: GroupTheme;
  isSelected: boolean;
  onClick: (theme: GroupTheme) => void;
}

function ThemeColorItem({ theme, isSelected, onClick }: ThemeColorItemProps) {
  const handleClick = () => {
    onClick(theme);
  };

  return (
    <div
      className={`theme-color-item ${isSelected ? "selected" : ""}`}
      style={{ backgroundColor: theme.primaryColor }}
      onClick={handleClick}
    ></div>
  );
}

function themeReducer(
  state: GroupTheme | null,
  action: { type: "SELECT"; theme: GroupTheme }
) {
  return action.type === "SELECT" ? action.theme : state;
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
      const themeMapping = themeColorMappings[selectedTheme.id];
      await UniversimeApi.Group.editTheme({
        groupId: organizationId,
        ...themeMapping,
      });
      applyThemeStyles(themeMapping);
    } catch {
      showErrorModal(
        "Erro ao salvar alterações",
        "Ocorreu um erro ao salvar as alterações do tema. Por favor, tente novamente."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const organizationTheme =
        ((auth.organization ?? ({} as any)).groupSettings ?? ({} as any))
          .theme ?? ({} as any);
      if (organizationTheme) {
        themeDispatch({ type: "SELECT", theme: organizationTheme });
        setOrganizationId(auth.organization?.id!);
        applyThemeStyles(organizationTheme);
      }
    };
    fetchData();
  }, [auth.organization]);

  return (
    <div id="theme-color-settings">
      <SettingsTitle>Configuração de Tema</SettingsTitle>
      <SettingsDescription>Escolha o tema para o grupo.</SettingsDescription>

      <div className="theme-color-list">
        {Object.values(themeColorMappings).map((theme) => (
          theme.id !== "themeDefeaut" && (
            <ThemeColorItem
              key={theme.id}
              theme={theme}
              isSelected={selectedTheme?.id === theme.id}
              onClick={(selected) =>
                themeDispatch({ type: "SELECT", theme: selected })
              }
            />
          )
        ))}
      </div>

      <div className="save-button">
        <div className="spacer" />
        <ActionButton name="Salvar" buttonProps={{ onClick: saveChanges }} />
      </div>
    </div>
  );
}