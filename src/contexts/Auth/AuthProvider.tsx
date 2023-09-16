import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Profile } from "@/types/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const user = profile?.user ?? null;

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
        setProfile(data.body.profile);
      }
  }

  function setLoggedUser(profile: Profile): boolean {
    if (!profile)
      return false;

    setProfile(profile);
    return true;
  }

  async function signin(email: string, password: string) {
      const data = await UniversimeApi.Auth.signin({ username: email, password });

      if (data.success && data.body !== undefined) {
        const profile = await UniversimeApi.Profile.profile();

        return {
            status: setLoggedUser(profile.body?.profile!),
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
      const profile = await UniversimeApi.Profile.profile();
      return setLoggedUser(profile.body.profile);
    };

  async function signout() {
    setProfile(null);
    const data = await UniversimeApi.Auth.logout();
    if(data) {
      window.location.href = location.origin + "/login";
    }
  };
};
