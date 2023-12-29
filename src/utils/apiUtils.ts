import { Group } from "@/types/Group";

export function groupBannerUrl(group: Group) {
    if(!group.bannerImage)
        return "/assets/imgs/default_bg.jpg"

    return `${import.meta.env.VITE_UNIVERSIME_API}/group/banner/${group.id}`;
}

export function groupHeaderUrl(group: Group) {
    if(group?.headerImage) {
        return  group?.headerImage.startsWith('/') ? import.meta.env.VITE_UNIVERSIME_API + group?.headerImage : group?.headerImage;
    }
    return `/assets/imgs/organization-headers/${group?.nickname ?? `codata`}.png`
}

export function groupImageUrl(group: Group) {
    if(!group.image)
        return "/assets/imgs/group.png"

    return `${import.meta.env.VITE_UNIVERSIME_API}/group/image/${group.id}`;
}
