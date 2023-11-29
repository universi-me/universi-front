import React, { useReducer } from "react";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import UniversimeApi from "@/services/UniversimeApi";
import type { GroupThemeEdit } from "@/types/Group";
import "./GroupThemeColor.less";

const themeColorMappings: Record<string, GroupThemeEdit> = {
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
  theme: GroupThemeEdit;
  isSelected: boolean;
  onClick: (theme: GroupThemeEdit) => void;
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

function themeReducer(state: GroupThemeEdit | null, action: { type: "SELECT"; theme: GroupThemeEdit }) {
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

export function GroupThemeColorPage({ organizationId }: { organizationId: string }) {
  const [selectedTheme, themeDispatch] = useReducer(themeReducer, null);

  const saveChanges = async () => {
    if (!selectedTheme) {
      showErrorModal("Erro ao salvar alterações", "Selecione um tema antes de salvar.");
      return;
    }

    try {
      const groupId = organizationId;
      const themeMapping = themeColorMappings[selectedTheme.id];
      await UniversimeApi.Group.editTheme({
        groupId,
        ...themeMapping,
      });


      showSuccessModal("Alterações salvas!", "O tema foi atualizado com sucesso");
    } catch {
      showErrorModal("Erro ao salvar alterações", "Ocorreu um erro ao salvar as alterações do tema. Por favor, tente novamente.");
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