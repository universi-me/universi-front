import type { GroupTheme } from "@/types/Group";

export const applyThemeStyles = (themeMapping: GroupTheme) => {
    for (const [property, variableName] of Object.entries(GroupThemeToCssVariable)) {
        const key = property as keyof GroupTheme;

        document.documentElement.style.setProperty(variableName, themeMapping[key]);
        console.log(`setting ${key} to ${variableName}`)
    }
}

export const GroupThemeToCssVariable: Record<keyof GroupTheme, string> = {
    primaryColor: "--primary-color",
    secondaryColor: "--secondary-color",
    backgroundColor: "--background-color",
    cardBackgroundColor: "--card-background-color",
    cardItemColor: "--card-item-color",
    fontColorV1: "--font-color-v1",
    fontColorV2: "--font-color-v2",
    fontColorV3: "--font-color-v3",
    fontColorLinks: "--font-color-links",
    fontColorDisabled: "--font-color-disabled",
    buttonHoverColor: "--button-hover-color",
    fontColorAlert: "--font-color-alert",
    fontColorSuccess: "--font-color-success",
    wrongInvalidColor: "--wrong-invalid-color",
};

export const GroupThemeToLabel: Record<keyof GroupTheme, string> = {
    // TODO: Name all variables
    primaryColor:           "Cor primária",
    secondaryColor:         "Cor secundária",
    backgroundColor:        "Cor de fundo",
    cardBackgroundColor:    "Cor de fundo de cartões",
    cardItemColor:          "Cor de de itens de cartões",
    fontColorV1:            "Cor de fonte 1",
    fontColorV2:            "Cor de fonte 2",
    fontColorV3:            "Cor de fonte 3",
    fontColorLinks:         "Cor de fonte de links",
    fontColorDisabled:      "Cor de fonte desabilitada",
    buttonHoverColor:       "buttonHoverColor",
    fontColorAlert:         "Cor de alerta",
    fontColorSuccess:       "Cor de sucesso",
    wrongInvalidColor:      "Cor de erro",
};
