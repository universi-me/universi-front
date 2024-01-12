import { useContext } from "react";
import { ProfileContentItem } from "../ProfileContentItem/ProfileContentItem";
import "./ProfileContentListing.css"
import { ProfileContext } from "../ProfileContext";

export function ProfileContentListing(){

    const profileContext = useContext(ProfileContext);
    if (profileContext == null)
        return null;

    const availableContents = profileContext.profileListData.folders
        .slice(0)
        .sort((content1, content2) => {
            return content1.name.localeCompare(content2.name);
        })

    const isOwnProfile = !!profileContext?.accessingLoggedUser;
    const hasOtherProfile = !!profileContext?.profile.firstname;

    const otherProfileText = hasOtherProfile
        ? `Conteúdos de ${profileContext.profile.firstname}`
        : "Conteúdos";

    const tabTitle = isOwnProfile
        ? "Meus Conteúdos"
        : otherProfileText;

      return(
        <div>
            <h1 className="content-name">{tabTitle}</h1>
            <div className="contents">
                { availableContents.length === 0 ? <p>Nenhum conteúdo atribuído no momento.</p> :
                    availableContents.map(content => (
                        <ProfileContentItem content={content} key={content.id} />
                    ))
                }
            </div>
        </div>
      )
}
