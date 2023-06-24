import { useParams } from "react-router-dom";
import { ProfileBio } from './LeftSide/ProfileBio'
import { ProfileGroups } from "./LeftSide/ProfileGroups";
import { ProfileAchievements } from "./LeftSide/ProfileAchievements";

import './Profile.css'
import './LeftSide/card.css'
import './LeftSide/section.css'
import { ProfileRecommendButton } from "./RightSide/ProfileRecommendButton";
import { ProfileSkills } from "./RightSide/ProfileSkills";

export function ProfilePage() {
    const { id } = useParams();

    // todo: check if logged user has this id
    const loggedUserProfile = id == 'user';

    return (
        <div id="profile-page">
            {/* todo: color from API */}
            <div id="user-header-bar" style={{background: "#515151"}} />

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
                    <ProfileRecommendButton loggedUserProfile={loggedUserProfile}/>
                    <ProfileSkills skills={['', '', '']} />
                </div>
            </div>
        </div>
    );
}
