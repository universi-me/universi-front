import React, { useEffect, useReducer } from "react";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import UniversimeApi from "@/services/UniversimeApi";
import "./GroupThemeColor.less";

const themeColorMappings = {
  themeId1: {
    id: "themeId1",
    name: "Tema 1",
    "--primary-color": "#0091B9",
    "--secondary-color": "#934588",
    "--tertiary-color": "#FFFFFF",
    "--background-color": "#F5F4F4",
    "--card-background-color": "#D9D9D9",
    "--card-item-color": "#F3F3F3",
    "--font-color-v1": "#FFFFFF",
    "--font-color-v2": "#191919",
    "--font-color-v3": "#8A8A8A",
    "--font-color-v4": "#7D7EAE",
    "--font-color-v5": "#F5F5F5",
    "--font-color-v6": "#4E4E4E",
    "--font-disabled-color": "#6F6F6F",
    "--forms-color": "#E0E0E0",
    "--skills-1-color": "#934588",
    "--wave-color": "#9294CC",
    "--button-yellow-hover-color": "#d3a61e",
    "--button-hover-color": "#FFFFFF", 
    "--alert-color": "#CC615B",
    "--success-color": "#35BD00",
    "--wrong-invalid-color": "#B33B3B",
    "--rank-color": "#6E70AF",
  },
  
  themeId2: {
    id: "themeId2",
    name: "Tema 2",
    "--primary-color": "#FF5733",
    "--secondary-color": "#5E35B1",
    "--tertiary-color": "#00C853",
    "--background-color": "#E6EE9C",
    "--card-background-color": "#FFCCBC",
    "--card-item-color": "#B2DFDB",
    "--font-color-v1": "#FFD54F",
    "--font-color-v2": "#303F9F",
    "--font-color-v3": "#689F38",
    "--font-color-v4": "#FF4081",
    "--font-color-v5": "#212121",
    "--font-color-v6": "#64FFDA",
    "--font-disabled-color": "#CFD8DC",
    "--forms-color": "#FF6F00",
    "--skills-1-color": "#5E35B1",
    "--wave-color": "#81C784",
    "--button-yellow-hover-color": "#EF5350",
    "--button-hover-color": "#00C853",
    "--alert-color": "#4FC3F7",
    "--success-color": "#64FFDA",
    "--wrong-invalid-color": "#FF5252",
    "--rank-color": "#00BFA5",
  },
  themeId3: {
    id: "themeId3",
    name: "Tema 3",
    "--primary-color": "#FFEB3B",
    "--secondary-color": "#03A9F4",
    "--tertiary-color": "#FFC107",
    "--background-color": "#B2EBF2",
    "--card-background-color": "#FFD180",
    "--card-item-color": "#FF80AB",
    "--font-color-v1": "#880E4F",
    "--font-color-v2": "#01579B",
    "--font-color-v3": "#FF8F00",
    "--font-color-v4": "#004D40",
    "--font-color-v5": "#F57F17",
    "--font-color-v6": "#3E2723",
    "--font-disabled-color": "#757575",
    "--forms-color": "#E64A19",
    "--skills-1-color": "#03A9F4",
    "--wave-color": "#CDDC39",
    "--button-yellow-hover-color": "#FF5722",
    "--button-hover-color": "#FFC107",
    "--alert-color": "#536DFE",
    "--success-color": "#8BC34A",
    "--wrong-invalid-color": "#FFD600",
    "--rank-color": "#795548",
  },
};

export function GroupThemeColorPage() {
  const [selectedTheme, themeDispatch] = useReducer(themeReducer, null);

  const saveChanges = async () => {
    if (!selectedTheme) {
      SwalUtils.fireModal({
        title: "Erro ao salvar alterações",
        text: "Selecione um tema antes de salvar.",
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const groupId = "groupId"; 
      const themeMapping = themeColorMappings[selectedTheme.id];
      
      // Ajuste o método editTheme conforme necessário para se adequar ao seu código
      await UniversimeApi.Group.editTheme({
        groupId,
        ...themeMapping,
      });

      SwalUtils.fireModal({
        title: "Alterações salvas!",
        text: `O tema foi atualizado para ${selectedTheme.name}.`,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    } catch (error) {
      SwalUtils.fireModal({
        title: "Erro ao salvar alterações",
        text: "Ocorreu um erro ao salvar as alterações do tema. Por favor, tente novamente.",
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    }
  };

  function themeReducer(state, action) {
    if (action.type === "SELECT") {
      return action.theme;
    }
    return state;
  }

  return (
    <div id="theme-color-settings">
      <SettingsTitle>Configuração de Tema</SettingsTitle>
      <SettingsDescription>Escolha o tema para o grupo.</SettingsDescription>

      <div className="theme-color-list">
        {Object.values(themeColorMappings).map((theme) => (
          <div
            key={theme.id}
            className={`theme-color-item ${selectedTheme?.id === theme.id ? "selected" : ""}`}
            style={{ backgroundColor: theme["--primary-color"] }}
            onClick={() => themeDispatch({ type: "SELECT", theme })}
          ></div>
        ))}
      </div>

      <div className="save-button">
        <div className="spacer" />
        <ActionButton name="Salvar" buttonProps={{ onClick: saveChanges }} />
      </div>
    </div>
  );
}