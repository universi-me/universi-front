import { useParams } from "react-router-dom";
import { ProfileBio } from './ProfileBio/ProfileBio'
import { ProfileGroups } from "./ProfileGroups/ProfileGroups";
import { ProfileAchievements } from "./ProfileAchievements/ProfileAchievements";
import { ProfileRecommendSettingsButton } from "./ProfileRecommendSettingsButton/ProfileRecommendSettingsButton";
import { ProfileSkills } from "./ProfileSkills/ProfileSkills";
import { ProfileLastRecommendations } from './ProfileLastRecommendations/ProfileLastRecommendations'

import './Profile.css'
import './card.css'
import './section.css'

export function ProfilePage() {
    const { id } = useParams();

    // todo: check if logged user has this id
    const loggedUserProfile = id == 'user';

    return (
        <div id="profile-page">
            {/* todo: color from API */}
            <div id="user-header-bar" style={{background: "#515151"}}>
                {
                    loggedUserProfile ?
                        <button className="edit-button" >
                            <img src='/assets/icons/edit.svg' alt="Editar" />
                        </button>
                    : null
                }
            </ div>

            <div className="content">
                <div id="left-side">
                    {/* todo: bio data from API */}
                    <ProfileBio
                        name={'Nome & Sobrenome'}
                        image={'#505050'}
                        memberSince={'00/00/0000'}
                        functionPronouns={'Função | Pronome'}
                        aboutMe={'Lorem ipsum dolor sit amet. Hic dolor reiciendis rem earum voluptatem sit similique magnam est repellat mollitia. Et nesciunt consequuntur a vero rerum aut optio tempore aut.'}
                        links={['', '', '', '']}
                        loggedUserProfile={loggedUserProfile}
                    />

                    {/* todo: groups from API */}
                    <ProfileGroups
                        count={0}
                        groups={['', '', '', '']}
                    />

                    {/* todo: achievements from API */}
                    <ProfileAchievements
                        count={0}
                        achievements={['', '', '', '']}
                    />
                </div>

                <div id="right-side">
                    <ProfileRecommendSettingsButton loggedUserProfile={loggedUserProfile} />
                    <ProfileSkills skills={['', '', '']} loggedUserProfile={loggedUserProfile} />
                    <ProfileLastRecommendations recommendations={['', '']} />
                </div>
            </div>
        </div>
    );
}
