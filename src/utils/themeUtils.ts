import type { GroupTheme } from "@/types/Group";

export const applyThemeStyles = (themeMapping: GroupTheme) => {
    for (const [property, variableName] of Object.entries(GroupThemeToCssVariable)) {
        document.documentElement.style.setProperty(property, variableName);
    }
}

export const GroupThemeToCssVariable: Record<keyof GroupTheme, string> = {
    primaryColor: "--primary-color",
    secondaryColor: "--secondary-color",
    tertiaryColor: "--tertiary-color",
    backgroundColor: "--background-color",
    cardBackgroundColor: "--card-background-color",
    cardItemColor: "--card-item-color",
    fontColorV1: "--font-color-v1",
    fontColorV2: "--font-color-v2",
    fontColorV3: "--font-color-v3",
    fontColorV4: "--font-color-v4",
    fontColorV5: "--font-color-v5",
    fontColorDisabled: "--font-color-disabled",
    skills1Color: "--skills-1-color",
    buttonHoverColor: "--button-hover-color",
    fontColorAlert: "--font-color-alert",
    fontColorSuccess: "--font-color-success",
    wrongInvalidColor: "--wrong-invalid-color",
};
