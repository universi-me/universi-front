export const applyThemeStyles = (themeMapping: Group.Theme) => {
    for (const [property, variableName] of Object.entries(GroupThemeToCssVariable)) {
        const key = property as keyof Group.Theme;

        document.documentElement.style.setProperty(variableName, themeMapping[key]);
    }
}

export const GroupThemeToCssVariable: Record<keyof Group.Theme, string> = {
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

export const GroupThemeToLabel: Record<keyof Group.Theme, { label: string, description?: string }> = {
    // TODO: Label and describe all variables
    primaryColor: {
        label: "Cor primária",
        description: "Cor principal usada na plataforma"
    },

    secondaryColor: {
        label: "Cor secundária",
        description: "Cor secundária usada em contraste com a cor principal"
    },

    backgroundColor: {
        label: "Cor de fundo",
    },

    cardBackgroundColor: {
        label: "Cor de fundo de cartões",
    },

    cardItemColor: {
        label: "Cor de de itens de cartões",
    },

    fontColorV1: {
        label: "Cor de fonte 1",
        description: "Cor dos textos que o fundo é a cor principal"
    },

    fontColorV2: {
        label: "Cor de fonte 2",
        description: "Cor dos textos sobre a cor de fundo da página, cartões e itens de cartões"
    },

    fontColorV3: {
        label: "Cor de fonte 3",
    },

    fontColorLinks: {
        label: "Cor de fonte de links",
        description: "Cor de hyperlinks nas páginas"
    },

    fontColorDisabled: {
        label: "Cor de fonte desabilitada",
        description: "Cor dos textos sem destaque e botões desativados"
    },

    buttonHoverColor: {
        label: "buttonHoverColor",
        description: "Cor de fundo dos botões ao passar o mouse"
    },

    fontColorAlert: {
        label: "Cor de alerta",
        description: "Cor de alertas"
    },

    fontColorSuccess: {
        label: "Cor de sucesso",
    },

    wrongInvalidColor: {
        label: "Cor de erro",
    },
};
