import { GroupTheme } from "@/types/Group";
import { createContext } from "react";

export type ThemeContextType = {
    theme: GroupTheme | undefined;
};

export const ThemeContext = createContext<ThemeContextType>({
    theme: undefined,
});
