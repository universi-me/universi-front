import { useContext, useMemo } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import "./GroupSubmenu.less"
import { GroupContext } from "../GroupContext"
import { AuthContext } from "@/contexts/Auth"
import { UniversimeApi } from "@/services"
import { hasAvailableOption, OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils"

export function GroupSubmenu(){
    const context = useContext(GroupContext);
    const authContext = useContext(AuthContext);

    const options = useMemo(makeGroupOptions, [ context?.group.id, authContext.user ]);

    if (!context || !hasAvailableOption(options, context.group))
        return null;

    return <DropdownMenu.Root>
        <div id="group-submenu">
            <DropdownMenu.Trigger asChild>
                <button id="group-submenu-trigger">
                    <span className="bi bi-three-dots-vertical" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content side="bottom" id="group-submenu-options">
                { options.map(o => renderOption(context.group, o)) }
            </DropdownMenu.Content>
        </div>
    </DropdownMenu.Root>;

    function makeGroupOptions(): OptionInMenu<Group.DTO>[] {
        return [
        {
            text: "Sair deste grupo",
            biIcon: "door-open-fill",
            hidden(data) {
                return !!data.rootGroup;
            },
            async onSelect(data) {
                await UniversimeApi.GroupParticipant.leave( data.id! );
                return await Promise.all([
                    context!.refreshData(),
                    authContext.updateLoggedUser(),
                ])
            },
        }, {
            text: "Editar este grupo",
            biIcon: "pencil-fill",
            hidden(data) {
                return !data.canEdit;
            },
            onSelect(data) {
                context!.setEditGroup(data);
            }
        }, {
            text: "Editar atividade",
            biIcon: "pencil-fill",
            hidden( data ) {
                return !data.canEdit || !data.activity;
            },
            onSelect( data ) {
                context!.setEditActivity( data.activity );
            },
        }, {
            text: "Configurações",
            biIcon: "gear-fill",
            hidden(data) {
                return authContext.user?.accessLevel !== "ROLE_ADMIN";
            },
            onSelect(data) {
                context?.setGroupConfigModalOpen(true);
            },
        }
        ];
    }
}
