import { Folder } from "@/types/Capacity";
import './ProfileContentItem.css'
import { Link } from "react-router-dom";
import { IMG_DEFAULT_CONTENT } from "@/utils/assets";
import { isAbsoluteUrl } from "@/utils/regexUtils";

export type ProfileContentItemProps = {
    content: Folder;
};

export function ProfileContentItem({content} : Readonly<ProfileContentItemProps>){
    const imageUrl = content.image
        ? isAbsoluteUrl(content.image)
            ? content.image
            : import.meta.env.VITE_UNIVERSIME_API + content.image
        : IMG_DEFAULT_CONTENT;

    return(
        <Link className="profile-content" to={`/capacitacao/folder/${content.id}`}>
            {/* todo: fix content URL */}
            <img src={imageUrl} className="profile-content-thumbnail" alt=""/>
            <p className="profile-content-title">{content.name}</p>
        </Link>
    )
}
