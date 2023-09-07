import { LoaderFunctionArgs } from "react-router-dom";
import UniversimeApi from "@/services/UniversimeApi";
import { Group, GroupType, GroupTypeToLabel } from "@/types/Group";

export type ManageGroupLoaderResponse = {
    editedGroup:         Group | null;
    availableParents:    Group[];
    availableGroupTypes: {label: string, value: GroupType}[];
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
        return response.body.groups;

    else
        return [];
}

function getGroupTypes() {
    return Object.entries(GroupTypeToLabel).map(([groupType, label]) => {
        return {
            label,
            value: groupType as GroupType,
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
