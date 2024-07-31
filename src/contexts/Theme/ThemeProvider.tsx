import { PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "@/contexts/Auth";
import ThemeContext, { ThemeContextType } from "@/contexts/Theme";
import { applyThemeStyles } from "@/utils/themeUtils";
import { GroupTheme } from "@/types/Group";
import ThemeMappings from "@/pages/Settings/GroupThemeColorPage/ThemeMappings";

export type ThemeProviderProps = PropsWithChildren<{}>;

export function ThemeProvider(props: Readonly<ThemeProviderProps>) {
    const { children } = props;

    const auth = useContext(AuthContext);
    const [theme, setTheme] = useState<GroupTheme>(auth.organization.groupSettings.theme ?? ThemeMappings.defaultTheme);

    const contextValue = useMemo<ThemeContextType>(() => ({
        theme,
        changeTheme: t => { setTheme(t ?? ThemeMappings.defaultTheme) },
    }), [theme])

    useEffect(() => {
        setTheme(auth.organization.groupSettings.theme ?? ThemeMappings.defaultTheme);
    }, [auth.organization.groupSettings.theme])

    useEffect(() => {
        applyThemeStyles(theme);
    }, [theme])

    return <ThemeContext.Provider value={contextValue}>
        { children }
    </ThemeContext.Provider>
}
