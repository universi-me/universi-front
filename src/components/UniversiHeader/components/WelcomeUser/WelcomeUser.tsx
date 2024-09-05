import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { AuthContext } from "@/contexts/Auth";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { IMG_DEFAULT_PROFILE } from "@/utils/assets";
import { OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";

import { ProfileClass } from "@/types/Profile";
import "./WelcomeUser.less"

export function WelcomeUser() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [profileClicked, setProfileClicked] = useState(false)

    const isLogged = useMemo(() => {
        return auth?.user !== null;
    }, [auth?.user?.id]);

    return( !isLogged ? null
        :<div className="image-container">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <div>
                        <ProfileImage className="logged-user-image" imageUrl={auth.profile?.imageUrl} name={auth.profile?.fullname} onClick={() => {setProfileClicked(!profileClicked)}}/>
                    </div>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content side="bottom" className="submenu-profile">
                    { makeProfileOptions().map(o => renderOption(auth.profile!, o)) }
                    <DropdownMenu.Arrow className="profile-options-arrow" height=".5rem" width="1rem" />
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    )

    function makeProfileOptions(): OptionInMenu<ProfileClass>[] {
        return [{
            text: "Perfil",
            className: "submenu-item",
            onSelect(data) {
                navigate(`/profile/${data.user.name}`);
            }
        }, {
            text: "Configurações",
            className: "submenu-item",
            hidden(data) {
                return data.user.accessLevel !== "ROLE_ADMIN";
            },
            onSelect(data) {
                navigate(`/settings`);
            }
        }, {
            text: "Sair",
            className: "submenu-item",
            onSelect(data) {
                auth.signout()
            },
        }];
    }
}
