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
      const data = await UniversimeApi.Profile.profile();

      if (data.body.profile) {
        setUser(data.body.profile.user);
        setProfile(data.body.profile);
      }
  }

  function setLoggedUser(user: User, profile: Profile): boolean {
    if (!user || !profile)
      return false;

    setUser(user);
    setProfile(profile);
    return true;
  }

  async function signin(email: string, password: string) {
      const data = await UniversimeApi.Auth.signin({ username: email, password });

      if (data.success && data.body !== undefined) {
        const profile = await UniversimeApi.Profile.profile();

        return {
            status: setLoggedUser(data.body.user, profile.body?.profile!),
            user: data.body.user,
        };
      }

      else {
        return {
            status: false,
            user: undefined,
        };
      }
  }

  async function signin_google(user: any) {
      const data = user;
      const profile = await UniversimeApi.Profile.profile();
      return setLoggedUser(data.body.user, profile.body.profile);
    };

  async function signout() {
    setUser(null);
    setProfile(null);
    const data = await UniversimeApi.Auth.logout();
    if(data) {
      window.location.href = location.origin + "/login";
    }
  };
};
