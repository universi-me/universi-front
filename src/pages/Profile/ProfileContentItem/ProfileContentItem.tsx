import { Folder } from "@/types/Capacity";
import './ProfileContentItem.css'
import { Link } from "react-router-dom";

export function ProfileContentItem({content} : {content : Folder}){

    return(

        <div className="profile-content">
            <Link to={`/capacitacao/folder/${content.id}`}>
                <img src={content.image ?? undefined} className="profile-content-thumbnail"/>
            </Link>
            <p className="profile-content-title">{content.name}</p>
        </div>
    )

}