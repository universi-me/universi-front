import { GroupTheme } from "@/types/Group";
import { createContext } from "react";

export type ThemeContextType = {
    theme: GroupTheme;
    changeTheme(theme: GroupTheme): void;
};

export const ThemeContext = createContext<ThemeContextType>(undefined!);
