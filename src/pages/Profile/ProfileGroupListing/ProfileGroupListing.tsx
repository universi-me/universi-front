import { useContext } from "react";
import { ProfileContext } from "../ProfileContext";
import { Link } from "react-router-dom";
import "./ProfileGroupListing.css"

export function ProfileGroupListing(){
    const profileContext = useContext(ProfileContext)

    if(profileContext == null)
        return null

    const groupCount = profileContext.profileListData.groups.length.toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    return(
        <>
        <h1 className="group-name">Meus Grupos</h1>
        <div className="groups-listing-container">
            {
                profileContext.profileListData.groups.length <= 0
                ? <div className="empty-groups">Não participa de um grupo.</div>
                : <>
                    {
                        profileContext.profileListData.groups.map((group) => {
                            return group === undefined ? null : (
                                <Link to={`/group${group.path}`} className="group-item-listing" title={group.name} key={group.id}>
                                    {/* todo: set group url */}
                                    <img src={group.image} alt="" />
                                </Link>
                            );
                        })
                    }
                </>
            }
        </div>
        </>
    )
}