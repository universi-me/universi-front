import { Group } from "@/types/Group";
import { IMG_DEFAULT_BANNER, IMG_DEFAULT_CONTENT, IMG_DEFAULT_GROUP } from "@/utils/assets";
import { type Folder } from "@/types/Capacity";
import { isAbsoluteUrl } from "./regexUtils";

export function groupBannerUrl(group: Group) {
    if(!group.bannerImage)
        return IMG_DEFAULT_BANNER;

    if (group.bannerImage.startsWith("/")) {
        return import.meta.env.VITE_UNIVERSIME_API + group.bannerImage;
    }

    return `${import.meta.env.VITE_UNIVERSIME_API}/group/banner/${group.id}`;
}

export function groupHeaderUrl(group: Group) {
    if(group.headerImage) {
        return isAbsoluteUrl(group.headerImage)
            ? group.headerImage
            : import.meta.env.VITE_UNIVERSIME_API + group.headerImage;
    }

    if (group.organization)
        return groupHeaderUrl(group.organization);

    return undefined;
}

export function groupImageUrl(group: Group) {
    if(!group.image)
        return IMG_DEFAULT_GROUP;

    if (group.image.startsWith("/")) {
        return import.meta.env.VITE_UNIVERSIME_API + group.image;
    }

    return `${import.meta.env.VITE_UNIVERSIME_API}/group/image/${group.id}`;
}

export function contentImageUrl(content: Folder) {
    if (!content.image)
        return IMG_DEFAULT_CONTENT;

    return isAbsoluteUrl(content.image)
        ? content.image
        : import.meta.env.VITE_UNIVERSIME_API + content.image;
}
