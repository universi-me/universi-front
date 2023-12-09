import { useContext, useMemo, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { AuthContext } from "@/contexts/Auth";
import "./WelcomeUser.less"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export function WelcomeUser() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [profileClicked, setProfileClicked] = useState(false)

    const isLogged = useMemo(() => {
        return auth?.user !== null;
    }, [auth?.user]);

    const welcomeMessage = auth.profile?.firstname ? `, ${auth.profile.firstname}` : "";

    return( !isLogged ? null
        :<div className="image-container">
            <ProfileImage className="logged-user-image" imageUrl={auth.profile ? auth.profile.imageUrl : undefined} noImageColor="var(--card-background-color)" onClick={() => {setProfileClicked(!profileClicked)}}/>
            {
                profileClicked 
                ?
                    <div className="submenu-profile">
                        <div className="submenu-item" onClick={()=>{navigate("/profile/"+auth.profile?.user.name); setProfileClicked(false)}}>
                            Perfil
                        </div>
                        { auth.user?.accessLevel === "ROLE_ADMIN" && <div className="submenu-item" onClick={() => {navigate("/settings"); setProfileClicked(false)}}>
                            Configurações
                        </div> }
                        <div className="submenu-item" onClick={()=>{auth.signout(); setProfileClicked(false)}}>
                            Sair
                        </div>
                    </div>
                :
                    <></>
            }
        </div>
        
    )
}
