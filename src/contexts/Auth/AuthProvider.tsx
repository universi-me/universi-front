import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "@/types/User";
import { Profile } from "@/types/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    validateToken();
  }, [UniversimeApi]);

  return (
    <AuthContext.Provider value={{ user, signin, signout, signin_google, profile }}>
      {children}
    </AuthContext.Provider>
  );

  async function validateToken() {
    const storageData = localStorage.getItem("AuthToken");
    if (storageData) {
      const data = await UniversimeApi.Profile.profile();

      if (data.body.profile) {
        setUser(data.body.profile.user);
        setProfile(data.body.profile);
      }
    }
  }

  function setLoggedUser(user: User, token: string, profile: Profile): boolean {
    if (!user || !token || !profile)
      return false;

    setUser(user);
    setProfile(profile);
    setToken(token);
    return true;
  }

  async function signin(email: string, password: string) {
      const data = await UniversimeApi.Auth.signin({ username: email, password });
      const profile = await UniversimeApi.Profile.profile();
      return new Promise<{status : boolean, user : User}>((resolve, reject) => {

        resolve ({status : setLoggedUser(data.body.user, data.token, profile.body.profile), user:data.body.user});

      })   
  }

  async function signin_google(user: any) {
      const data = user;
      const profile = await UniversimeApi.Profile.profile();
      return setLoggedUser(data.body.user, data.token, profile.body.profile);
    };

  async function signout() {
    setUser(null);
    setProfile(null);
    setToken("");
    const data = await UniversimeApi.Auth.logout();
    if(data) {
      window.location.href = location.origin + "/login";
    }
  };

  function setToken(token: string) {
    localStorage.setItem("AuthToken", token);
  };
};
