import { Group } from "@/types/Group";

export function groupBannerUrl(group: Group) {
    if (group.organization?.bannerImage)
        group = group.organization;

    return `${import.meta.env.VITE_UNIVERSIME_API}/group/banner/${group.id}`;
}

export function groupImageUrl(group: Group) {
    return `${import.meta.env.VITE_UNIVERSIME_API}/group/image/${group.id}`;
}
