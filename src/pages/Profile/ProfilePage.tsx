import { useParams } from "react-router-dom";
import { useState } from "react";
import { Modal } from "@/components/Modal/Modal";

import {
    ProfileBio, ProfileGroups, ProfileAchievements, ProfileRecommendSettingsButton,
    ProfileSkills, ProfileLastRecommendations, ProfileSettings
} from '@/pages/Profile'

import './Profile.css'
import './card.css'
import './section.css'

export function ProfilePage() {
    const { id } = useParams();

    // todo: check if logged user has this id
    const loggedUserProfile = id == 'user';

    const [showProfileSettings, setShowProfileSettings] = useState<boolean>(false);

    return (
        <div id="profile-page">
            {/* todo: color from API */}
            <div id="user-header-bar" style={{background: "#515151"}}>
                {
                    loggedUserProfile ?
                        <button className="edit-button" >
                            <img src='/assets/icons/edit-1.svg' alt="Editar" />
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

                        editModalHelper={{shouldRender: showProfileSettings, onClickOutside: toggleProfileSettings}}
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

            {
                showProfileSettings &&
                <Modal onClickOutside={toggleProfileSettings} >
                    {/* todo: gender options from API */}
                    <ProfileSettings
                        genderOptions={[
                            { apiValue: 'M', name: 'Masculino' },
                            { apiValue: 'F', name: 'Feminino' },
                            { apiValue: 'O', name: 'Outro' },
                            { apiValue: 'N', name: 'Não informar' },
                        ]}
                        pronounsOptions={[
                            { apiValue: 'ELE', name: 'Ele/Dele' },
                            { apiValue: 'ELA', name: 'Ela/Dela' },
                            { apiValue: 'ELU', name: 'Elu/Delu' },
                            { apiValue: 'N',   name: 'Não informar' },
                        ]}
                        socialOptions={[
                            { apiValue: 'facebook',  name: 'Facebook' },
                            { apiValue: 'github',    name: 'Github' },
                            { apiValue: 'instagram', name: 'Instagram' },
                            { apiValue: 'linkedin',  name: 'LinkedIn' },
                        ]}
                        cancelChanges={toggleProfileSettings}
                        // todo: save profile settings
                        saveChanges={() => {alert('todo')}}
                    />
                </Modal>
            }
        </div>
    );

    function toggleProfileSettings() {
        setShowProfileSettings(!showProfileSettings);
    }
}
