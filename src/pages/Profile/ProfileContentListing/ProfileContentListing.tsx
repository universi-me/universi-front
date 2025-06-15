import { useContext } from "react";
import { ProfileContentItem } from "../ProfileContentItem/ProfileContentItem";
import "./ProfileContentListing.less"
import { ProfileContext } from "../ProfileContext";
import { compareContents } from "@/types/Capacity";

export function ProfileContentListing(){

    const profileContext = useContext(ProfileContext);
    if (profileContext == null)
        return null;

    const assignedContents = profileContext.profileListData.folders
        ?.slice(0).sort( compareContents );

    const favoriteContents = profileContext.profileListData.favorites
        .slice(0).sort( compareContents );

    const isOwnProfile = !!profileContext?.accessingLoggedUser;
    const hasOtherProfile = !!profileContext?.profile.firstname;

    const otherProfileText = hasOtherProfile
        ? `Conteúdos de ${profileContext.profile.firstname}`
        : "Conteúdos";

    const tabTitle = isOwnProfile
        ? "Meus Conteúdos"
        : otherProfileText;

    const assignedLabel = isOwnProfile
        ? "Atribuídos à mim"
        : `Atribuídos à ${profileContext.profile.firstname}`;

    const favoriteLabel = isOwnProfile
        ? "Meus favoritos"
        : `Favoritos de ${profileContext.profile.firstname}`;

      return(
        <div className="content-listing-container">
            <h1 className="content-name">{tabTitle}</h1>
            { assignedContents &&
            <div className="content-wrapper">
                <h2>{assignedLabel}</h2>
                <div className="contents">
                    { assignedContents.length === 0 ? <p>Nenhum conteúdo atribuído no momento.</p> :
                        assignedContents.map(content => (
                            <ProfileContentItem content={content} key={content.id} />
                        ))
                    }
                </div>
            </div>
            }
            <div className="content-wrapper">
                <h2>{favoriteLabel}</h2>
                <div className="contents">
                    { favoriteContents.length === 0 ? <p>Nenhum conteúdo atribuído no momento.</p> :
                        favoriteContents.map(content => (
                            <ProfileContentItem content={content} key={content.id} />
                        ))
                    }
                </div>
            </div>
        </div>
      )
}
