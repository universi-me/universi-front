import React, { useReducer, useEffect } from "react";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import "./GroupThemeColor.less";

const themeColors = [
  { name: "Dark-Theme", color: "#1a1a1a" },
  { name: "Green-Theme", color: "#00ff00" },
  { name: "Blue-Theme", color: "#0000ff" },
];

export function GroupThemeColorPage() {
  const [selectedTheme, themeDispatch] = useReducer(themeReducer, getSavedTheme() || themeColors[0]);

  const saveChanges = () => {
    saveThemeName(selectedTheme.name);

    SwalUtils.fireModal({
      title: "Alterações salvas!",
      text: `O tema foi atualizado para ${selectedTheme.name}.`,
      showConfirmButton: true,
      confirmButtonText: "OK",
    });
  };

  return (
    <div id="theme-color-settings">
      <SettingsTitle>Configuração de Tema</SettingsTitle>
      <SettingsDescription>Escolha o tema para o grupo.</SettingsDescription>

      <div className="theme-color-list">
        {themeColors.map((theme) => (
          <div
            key={theme.name}
            className={`theme-color-item ${selectedTheme.name === theme.name ? "selected" : ""}`}
            style={{ backgroundColor: theme.color }}
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

  function themeReducer(state, action) {
    if (action.type === "SELECT") {
      return action.theme;
    }
    return state;
  }

  function saveThemeName(themeName) {
    localStorage.setItem("selectedThemeName", themeName);
  }

  function getSavedTheme() {
    const savedThemeName = localStorage.getItem("selectedThemeName");
    return themeColors.find((theme) => theme.name === savedThemeName) || null;
  }
}
