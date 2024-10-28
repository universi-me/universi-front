import { createContext } from "react";
import { GroupTheme } from "@/types/Group";
import { Nullable } from "@/types/utils";

export type ThemeContextType = {
    theme: GroupTheme;
    changeTheme(theme: Nullable<GroupTheme>): void;
};

export const ThemeContext = createContext<ThemeContextType>(undefined!);
