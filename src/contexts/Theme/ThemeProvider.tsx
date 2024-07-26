import { PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "@/contexts/Auth";
import ThemeContext, { ThemeContextType } from "@/contexts/Theme";
import { applyThemeStyles } from "@/utils/themeUtils";
import { GroupTheme } from "@/types/Group";

export type ThemeProviderProps = PropsWithChildren<{}>;

export function ThemeProvider(props: Readonly<ThemeProviderProps>) {
    const { children } = props;

    const auth = useContext(AuthContext);
    const [theme, setTheme] = useState<GroupTheme>(auth.organization.groupSettings.theme);

    const contextValue = useMemo<ThemeContextType>(() => ({
        theme,
    }), [theme])

    useEffect(() => {
        setTheme(auth.organization.groupSettings.theme);
    }, [auth.organization.groupSettings.theme])

    useEffect(() => {
        applyThemeStyles(theme);
    }, [theme])

    return <ThemeContext.Provider value={contextValue}>
        { children }
    </ThemeContext.Provider>
}
