import { useContext, useMemo, useState } from "react";
import { Link, redirect } from "react-router-dom";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { AuthContext } from "@/contexts/Auth";
import "./WelcomeUser.less"
import { getProfileImageUrl } from "@/utils/profileUtils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export function WelcomeUser() {
    const auth = useContext(AuthContext);

    const [profileClicked, setProfileClicked] = useState(false)

    const isLogged = useMemo(() => {
        return auth?.user !== null;
    }, [auth?.user]);

    const welcomeMessage = auth.profile?.firstname ? `, ${auth.profile.firstname}` : "";

    return( !isLogged ? null
        :<div className="image-container">
            <ProfileImage className="logged-user-image" imageUrl={auth.profile ? getProfileImageUrl(auth.profile) : undefined} noImageColor="var(--card-background-color)" onClick={() => {setProfileClicked(!profileClicked)}}/>
            {
                profileClicked 
                ?
                    <div className="submenu-profile">
                        <div className="submenu-item" onClick={()=>{location.href="/profile/"+auth.profile?.user.name}}>
                            Perfil
                        </div>
                        <div className="submenu-item" onClick={()=>{auth.signout()}}>
                            Sair
                        </div>
                    </div>
                :
                    <></>
            }
        </div>
        
    )
}
