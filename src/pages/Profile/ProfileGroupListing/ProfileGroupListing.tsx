import { useContext } from "react";
import { ProfileContext } from "../ProfileContext";
import { groupImageUrl } from "@/utils/apiUtils";
import { Link } from "react-router-dom";
import "./ProfileGroupListing.css"

export function ProfileGroupListing(){
    const profileContext = useContext(ProfileContext)

    if(profileContext == null)
        return null

    const isOwnProfile = !!profileContext?.accessingLoggedUser;
    const hasOtherProfile = !!profileContext?.profile.firstname;

    const otherProfileText = hasOtherProfile
        ? `Grupos de ${profileContext.profile.firstname}`
        : "Grupos";

    const tabTitle = isOwnProfile
        ? `Meus Grupos`
        : otherProfileText;

    return(
        <>
        <h1 className="group-name">{tabTitle}</h1>
        <div className="groups-listing-container">
            {
                profileContext.profileListData.groups.filter( g => g.regularGroup ).map((group) => {
                    return group === undefined ? null : (
                        <Link to={`/group${group.path}`} className="group-item-listing" title={group.name} key={group.id}>
                            <img src={groupImageUrl(group)} alt="" />
                        </Link>
                    );
                })
            }
        </div>
        </>
    )
}
