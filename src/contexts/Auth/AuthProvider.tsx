import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "../../types/User";
import { UniversimeApi } from "../../hooks/UniversimeApi";

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    validateToken();
  }, [UniversimeApi]);

  return (
    <AuthContext.Provider value={{ user, signin, signout, signin_google }}>
      {children}
    </AuthContext.Provider>
  );

  async function validateToken() {
    const storageData = localStorage.getItem("AuthToken");
    if (storageData) {
      const data = await UniversimeApi.validateToken();
      if (data.user) {
        setUser(data.user);
      }
    }
  }

  async function signin(email: string, password: string) {
      const data = await UniversimeApi.signin(email, password);
      if (data.body.user && data.token) {
        setUser(data.body.user);
        setToken(data.token);
        return true;
      }
  
      return false;
  }

  function signin_google(user: any) {
      const data = user;
      if (data.body.user && data.token) {
        setUser(data.body.user);
        setToken(data.token);
        return true;
      }
      return false;
    };

  function signout() {
    setUser(null);
    setToken("");
    window.location.href = "/login"
  };

  function setToken(token: string) {
    localStorage.setItem("AuthToken", token);
  };
};
