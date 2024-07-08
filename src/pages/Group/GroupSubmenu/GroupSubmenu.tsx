import { useContext, useMemo } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import "./GroupSubmenu.css"
import { GroupContext } from "../GroupContext"
import { AuthContext } from "@/contexts/Auth"
import UniversimeApi from "@/services/UniversimeApi"
import { hasAvailableOption, OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils"
import { Group } from "@/types/Group"

export function GroupSubmenu(){
    const context = useContext(GroupContext);
    const authContext = useContext(AuthContext);

    const options = useMemo(makeGroupOptions, [context?.group.id]);

    if (!context || !hasAvailableOption(options, context.group))
        return null;

    return <DropdownMenu.Root>
        <div className="submenu">
            <DropdownMenu.Trigger asChild>
                <button style={{all: "unset"}}>
                    <span className="bi bi-three-dots-vertical dots" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content side="bottom">
                { options.map(o => renderOption(context.group, o)) }
            </DropdownMenu.Content>
        </div>
    </DropdownMenu.Root>;

    function makeGroupOptions(): OptionInMenu<Group>[] {
        return [
        {
            text: "Sair deste grupo",
            biIcon: "door-open",
            className: "box",
            hidden(data) {
                return !!data.rootGroup;
            },
            async onSelect(data) {
                await UniversimeApi.Group.exit({groupId: data.id});
                return await Promise.all([
                    context!.refreshData(),
                    authContext.updateLoggedUser(),
                ])
            },
        }, {
            text: "Editar este grupo",
            biIcon: "pencil-fill",
            className: "box",
            hidden(data) {
                return !data.canEdit;
            },
            onSelect(data) {
                context!.setEditGroup(data);
            }
        }, {
            text: "Configurações",
            biIcon: "gear-fill",
            className: "box",
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
