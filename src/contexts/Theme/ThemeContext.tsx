import { createContext } from "react";

export type ThemeContextType = {
    theme: GroupTheme;
    changeTheme(theme: Nullable<GroupTheme>): void;
};

export const ThemeContext = createContext<ThemeContextType>(undefined!);
