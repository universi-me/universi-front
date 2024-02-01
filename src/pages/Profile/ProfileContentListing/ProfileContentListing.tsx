import { useContext } from "react";
import { ProfileContentItem } from "../ProfileContentItem/ProfileContentItem";
import "./ProfileContentListing.less"
import { ProfileContext } from "../ProfileContext";

export function ProfileContentListing(){

    const profileContext = useContext(ProfileContext);
    if (profileContext == null)
        return null;

    const assignedContents = profileContext.profileListData.folders
        .slice(0)
        .sort((content1, content2) => {
            return content1.name.localeCompare(content2.name);
        });

    const favoriteContents = profileContext.profileListData.favorites
        .slice(0)
        .sort((content1, content2) => {
            return content1.name.localeCompare(content2.name);
        });

    const isOwnProfile = !!profileContext?.accessingLoggedUser;
    const hasOtherProfile = !!profileContext?.profile.firstname;

    const otherProfileText = hasOtherProfile
        ? `Conteúdos de ${profileContext.profile.firstname}`
        : "Conteúdos";

    const tabTitle = isOwnProfile
        ? "Meus Conteúdos"
        : otherProfileText;

      return(
        <div className="content-listing-container">
            <h1 className="content-name">{tabTitle}</h1>
            <div className="content-wrapper">
                <h2>Conteúdos atribuídos</h2>
                <div className="contents">
                    { assignedContents.length === 0 ? <p>Nenhum conteúdo atribuído no momento.</p> :
                        assignedContents.map(content => (
                            <ProfileContentItem content={content} key={content.id} />
                        ))
                    }
                </div>
            </div>
            <div className="content-wrapper">
                <h2>Conteúdos favoritos</h2>
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
