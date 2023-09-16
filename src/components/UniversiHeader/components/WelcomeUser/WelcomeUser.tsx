import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { AuthContext } from "@/contexts/Auth";
import "./WelcomeUser.less"
import { getProfileImageUrl } from "@/utils/profileUtils";

export function WelcomeUser() {
    const auth = useContext(AuthContext);

    const isLogged = useMemo(() => {
        return auth?.user !== null;
    }, [auth?.user]);

    const welcomeMessage = auth.profile?.firstname ? `, ${auth.profile.firstname}` : "";

    return !isLogged ? null
    : <Link className="welcome-wrapper" to={`/profile/${auth.user?.name}`}>
        <div className="welcome-message">Olá{welcomeMessage}!</div>
        <ProfileImage className="logged-user-image" imageUrl={auth.profile ? getProfileImageUrl(auth.profile) : undefined} noImageColor="var(--card-background-color)" />
      </Link>
}
