import type { GroupTheme } from "@/types/Group";
export const applyThemeStyles = (themeMapping: GroupTheme) => {
  const styleProperties = {
    "--primary-color":              themeMapping.primaryColor,
    "--secondary-color":            themeMapping.secondaryColor,
    "--tertiary-color":             themeMapping.tertiaryColor,
    "--background-color":           themeMapping.backgroundColor,
    "--card-background-color":      themeMapping.cardBackgroundColor,
    "--card-item-color":            themeMapping.cardItemColor,
    "--font-color-v1":              themeMapping.fontColorV1,
    "--font-color-v2":              themeMapping.fontColorV2,
    "--font-color-v3":              themeMapping.fontColorV3,
    "--font-color-v4":              themeMapping.fontColorV4,
    "--font-color-v5":              themeMapping.fontColorV5,
    "--font-color-v6":              themeMapping.fontColorV6,
    "--font-disabled-color":        themeMapping.fontDisabledColor,
    "--forms-color":                themeMapping.formsColor,
    "--skills-1-color":             themeMapping.skills1Color,
    "--wave-color":                 themeMapping.waveColor,
    "--button-yellow-hover-color":  themeMapping.buttonYellowHoverColor,
    "--button-hover-color":         themeMapping.buttonHoverColor,
    "--alert-color":                themeMapping.alertColor,
    "--success-color":              themeMapping.successColor,
    "--wrong-invalid-color":                themeMapping.wrongInvalidColor,
    "--rank-color":                 themeMapping.rankColor,
  };

  for (const [property, value] of Object.entries(styleProperties)) {
    document.documentElement.style.setProperty(property, value);
  }
};
