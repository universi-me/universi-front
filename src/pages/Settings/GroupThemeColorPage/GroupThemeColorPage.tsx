import React, { useEffect, useReducer, useState } from "react";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import UniversimeApi from "@/services/UniversimeApi";
import type { GroupTheme } from "@/types/Group";
import "./GroupThemeColor.less";
const themeColorMappings: Record<string, GroupTheme> = {
  themeId1: {
    id: "themeId1",
    primaryColor: "#0091B9",
    secondaryColor: "#934588",
    tertiaryColor: "#FFFFFF",
    backgroundColor: "#F5F4F4",
    cardBackgroundColor: "#D9D9D9",
    cardItemColor: "#F3F3F3",
    fontColorV1: "#FFFFFF",
    fontColorV2: "#191919",
    fontColorV3: "#8A8A8A",
    fontColorV4: "#7D7EAE",
    fontColorV5: "#F5F5F5",
    fontColorV6: "#4E4E4E",
    fontDisabledColor: "#6F6F6F",
    formsColor: "#E0E0E0",
    skills1Color: "#934588",
    waveColor: "#9294CC",
    buttonYellowHoverColor: "#d3a61e",
    buttonHoverColor: "#FFFFFF",
    alertColor: "#CC615B",
    successColor: "#35BD00",
    wrongInvalidColor: "#B33B3B",
    rankColor: "#6E70AF",
  },
  themeId2: {
    id: "themeId2",
    primaryColor: "#FF5733",
    secondaryColor: "#5E35B1",
    tertiaryColor: "#00C853",
    backgroundColor: "#E6EE9C",
    cardBackgroundColor: "#FFCCBC",
    cardItemColor: "#B2DFDB",
    fontColorV1: "#FFD54F",
    fontColorV2: "#303F9F",
    fontColorV3: "#689F38",
    fontColorV4: "#FF4081",
    fontColorV5: "#212121",
    fontColorV6: "#64FFDA",
    fontDisabledColor: "#CFD8DC",
    formsColor: "#FF6F00",
    skills1Color: "#5E35B1",
    waveColor: "#81C784",
    buttonYellowHoverColor: "#EF5350",
    buttonHoverColor: "#00C853",
    alertColor: "#4FC3F7",
    successColor: "#64FFDA",
    wrongInvalidColor: "#FF5252",
    rankColor: "#00BFA5",
  },
  themeId3: {
    id: "themeId3",
    primaryColor: "#FFEB3B",
    secondaryColor: "#03A9F4",
    tertiaryColor: "#FFC107",
    backgroundColor: "#B2EBF2",
    cardBackgroundColor: "#FFD180",
    cardItemColor: "#FF80AB",
    fontColorV1: "#880E4F",
    fontColorV2: "#01579B",
    fontColorV3: "#FF8F00",
    fontColorV4: "#004D40",
    fontColorV5: "#F57F17",
    fontColorV6: "#3E2723",
    fontDisabledColor: "#757575",
    formsColor: "#E64A19",
    skills1Color: "#03A9F4",
    waveColor: "#CDDC39",
    buttonYellowHoverColor: "#FF5722",
    buttonHoverColor: "#FFC107",
    alertColor: "#536DFE",
    successColor: "#8BC34A",
    wrongInvalidColor: "#FFD600",
    rankColor: "#795548",
  },
};

interface ThemeColorItemProps {
  theme: GroupTheme;
  isSelected: boolean;
  onClick: (theme: GroupTheme) => void;
}

function ThemeColorItem({ theme, isSelected, onClick }: ThemeColorItemProps) {
  return (
    <div
      className={`theme-color-item ${isSelected ? "selected" : ""}`}
      style={{ backgroundColor: theme.primaryColor }}
      onClick={() => onClick(theme)}
    ></div>
  );
}

function themeReducer(state: GroupTheme | null, action: { type: "SELECT"; theme: GroupTheme }) {
  if (action.type === "SELECT") {
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

const showSuccessModal = (title: string, text: string) => {
  SwalUtils.fireModal({
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: "OK",
  });
};

const applyThemeStyles = (themeMapping : GroupTheme) => {
  const styleProperties = {
    '--primary-color': themeMapping.primaryColor,
    '--secondary-color': themeMapping.secondaryColor,
    '--tertiary-color': themeMapping.tertiaryColor,
    '--background-color': themeMapping.backgroundColor,
    '--card-background-color': themeMapping.cardBackgroundColor,
    '--card-item-color': themeMapping.cardItemColor,
    '--font-color-v1': themeMapping.fontColorV1,
    '--font-color-v2': themeMapping.fontColorV2,
    '--font-color-v3': themeMapping.fontColorV3,
    '--font-color-v4': themeMapping.fontColorV4,
    '--font-color-v5': themeMapping.fontColorV5,
    '--font-color-v6': themeMapping.fontColorV6,
    '--font-disabled-color': themeMapping.fontDisabledColor,
    '--forms-color': themeMapping.formsColor,
    '--skills-1-color': themeMapping.skills1Color,
    '--wave-color': themeMapping.waveColor,
    '--button-yellow-hover-color': themeMapping.buttonYellowHoverColor,
    '--button-hover-color': themeMapping.buttonHoverColor,
    '--alert-color': themeMapping.alertColor,
    '--success-color': themeMapping.successColor,
    '--wrong-invalid-color': themeMapping.wrongInvalidColor,
    '--rank-color': themeMapping.rankColor,
  };

  for (const [property, value] of Object.entries(styleProperties)) {
    document.documentElement.style.setProperty(property, value);
  }
};

export function GroupThemeColorPage() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [selectedTheme, themeDispatch] = useReducer(themeReducer, null);

  useEffect(() => {
    const fetchOrganizationId = async () => {
      try {
        const org = await UniversimeApi.User.organization();
        if (org.success && org.body?.organization) {
          setOrganizationId(org.body.organization.id);
        } else {
          showErrorModal("Falha ao recuperar a organização.", "Tente novamente mais tarde");
        }
      } catch (error) {
        showErrorModal("Erro ao buscar a organização", "Tente novamente mais tarde");
      }
    };

    const fetchGroupTheme = async () => {
      try {
        const groupThemeResponse = await UniversimeApi.Group.getTheme(organizationId);
        if (groupThemeResponse.success && groupThemeResponse.body) {
          applyThemeStyles(groupThemeResponse.body);
          themeDispatch({ type: "SELECT", theme: groupThemeResponse.body });
        }
      } catch (error) {
        showErrorModal("Erro ao buscar o tema do grupo", "Tente novamente mais tarde");
      }
    };

    fetchOrganizationId();

    if (organizationId) {
      fetchGroupTheme();
    }
  }, [organizationId]); 

  const saveChanges = async () => {
    if (!selectedTheme || !organizationId) {
      showErrorModal("Erro ao salvar alterações", "Selecione um tema e obtenha a organização antes de salvar.");
      return;
    }

    try {
      const themeMapping = themeColorMappings[selectedTheme.id];
      await UniversimeApi.Group.editTheme({
        groupId: organizationId,
        ...themeMapping,
      });
      applyThemeStyles(themeMapping);
      showSuccessModal("Alterações salvas!", "O tema foi atualizado com sucesso");
    } catch {
      showErrorModal(
        "Erro ao salvar alterações",
        "Ocorreu um erro ao salvar as alterações do tema. Por favor, tente novamente."
      );
    }
  };

  return (
    <div id="theme-color-settings">
      <SettingsTitle>Configuração de Tema</SettingsTitle>
      <SettingsDescription>Escolha o tema para o grupo.</SettingsDescription>

      <div className="theme-color-list">
        {Object.values(themeColorMappings).map((theme) => (
          <ThemeColorItem
            key={theme.id}
            theme={theme}
            isSelected={selectedTheme?.id === theme.id}
            onClick={(selected) => themeDispatch({ type: "SELECT", theme: selected })}
          />
        ))}
      </div>

      <div className="save-button">
        <div className="spacer" />
        <ActionButton name="Salvar" buttonProps={{ onClick: saveChanges }} />
      </div>
    </div>
  );
}