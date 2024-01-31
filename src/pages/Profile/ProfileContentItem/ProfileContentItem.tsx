import { Folder } from "@/types/Capacity";
import './ProfileContentItem.css'
import { Link } from "react-router-dom";
import { contentImageUrl } from "@/utils/apiUtils";

export type ProfileContentItemProps = {
    content: Folder;
};

export function ProfileContentItem({content} : Readonly<ProfileContentItemProps>){
    return(
        <Link className="profile-content" to={`/content/${content.id}`}>
            <img src={contentImageUrl(content)} className="profile-content-thumbnail" alt=""/>
            <p className="profile-content-title">{content.name}</p>
        </Link>
    )
}
