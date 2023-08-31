import { LoaderFunctionArgs } from "react-router-dom";
import UniversimeApi from "@/services/UniversimeApi";
import { Group, GroupTypeToLabel } from "@/types/Group";

type ReactSelectOption = {
    label: string;
    value: string;
};

export type ManageGroupLoaderResponse = {
    editedGroup:         Group | null;
    availableParents:    ReactSelectOption[];
    availableGroupTypes: ReactSelectOption[];
};

export const EDIT_GROUP_PARAMETER = "edit-group";

export async function ManageGroupLoader(args: LoaderFunctionArgs): Promise<ManageGroupLoaderResponse> {
    const url = new URL(args.request.url);
    const editedGroupPath = url.searchParams.get(EDIT_GROUP_PARAMETER)

    return {
        editedGroup: await getEditedGroup(editedGroupPath),
        availableParents: await getAvailableParents(),
        availableGroupTypes: getGroupTypes(),
    };
}

async function getAvailableParents() {
    const response = await UniversimeApi.Group.availableParents();
    if (response.success && response.body)
        return response.body.groups.map((g): ReactSelectOption => {
            return {
                label: g.name,
                value: g.id,
            }
        });

    else
        return [];
}

function getGroupTypes() {
    return Object.entries(GroupTypeToLabel).map(([groupType, label]) => {
        return {
            label,
            value: groupType,
        };
    });
}

async function getEditedGroup(groupPath: string | null): Promise<Group | null> {
    if (groupPath === null)
        return null;

    const response = await UniversimeApi.Group.get({ groupPath });
    if (!response.success || !response.body)
        return null;

    return response.body.group;
}
