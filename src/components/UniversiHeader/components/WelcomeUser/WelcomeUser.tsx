import { useContext, useMemo, useState } from "react";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { AuthContext } from "@/contexts/Auth";
import { IMG_DEFAULT_PROFILE } from "@/utils/assets";
import { OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";
import { ProfileClass } from "@/types/Profile";
import "./WelcomeUser.less"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export function WelcomeUser() {
    const auth = useContext(AuthContext);
    const [profileClicked, setProfileClicked] = useState(false)

    const isLogged = useMemo(() => {
        return auth?.user !== null;
    }, [auth?.user?.id]);

    return( !isLogged ? null
        :<div className="image-container">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <div>
                        <ProfileImage className="logged-user-image" imageUrl={auth.profile?.imageUrl ?? IMG_DEFAULT_PROFILE} onClick={() => {setProfileClicked(!profileClicked)}}/>
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
            href(data) {
                return `/profile/${data.user.name}`;
            },
        }, {
            text: "Configurações",
            className: "submenu-item",
            hidden(data) {
                return data.user.accessLevel !== "ROLE_ADMIN";
            },
            href() {
                return `/settings`;
            },
        }, {
            text: "Sair",
            className: "submenu-item",
            onSelect(data) {
                auth.signout()
            },
        }];
    }
}
