import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { AuthContext } from "@/contexts/Auth";
import "./WelcomeUser.less"

export function WelcomeUser() {
    const auth = useContext(AuthContext);

    const isLogged = useMemo(() => {
        return auth?.user !== null;
    }, [auth, auth?.user]);

    return !isLogged ? null
    : <Link className="welcome-wrapper" to={`/profile/${auth.user?.name}`}>
        <div className="welcome-message">{`Olá, ${auth.profile?.firstname}`}</div>
        <ProfileImage className="logged-user-image" imageUrl={auth.profile?.image} noImageColor="var(--card-background-color)" />
      </Link>
}
