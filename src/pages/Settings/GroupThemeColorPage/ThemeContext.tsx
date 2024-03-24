import React, { createContext, useContext, useEffect, useState } from 'react';
import { applyThemeStyles } from "@/utils/themeUtils"; 
import { AuthContext } from "@/contexts/Auth/AuthContext";
import type { GroupTheme } from "@/types/Group";

type ChildrenType = React.ReactNode;

const ThemeContext = createContext<GroupTheme | null>(null);

export const ThemeProvider: React.FC<{ children: ChildrenType }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const [theme, setTheme] = useState<GroupTheme | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const organizationTheme = (((auth.organization ?? {} as any).groupSettings ?? {} as any).theme ?? {} as any);
      if (organizationTheme) {
        setTheme(organizationTheme);
        applyThemeStyles(organizationTheme);
      }
    };
    fetchData();
  }, [auth.organization]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);