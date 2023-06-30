import { useParams } from "react-router-dom";
import { useState } from "react";

import {
    ProfileBio, ProfileGroups, ProfileAchievements, ProfileRecommendSettingsButton,
    ProfileCompetences, ProfileLastRecommendations, ProfileSettings, CompetencesLevel, CompetencesSettings
} from '@/pages/Profile'
import { Modal } from "@/components/Modal/Modal";

import './Profile.css'
import './card.css'
import './section.css'

export function ProfilePage() {
    const { id } = useParams();

    // todo: check if logged user has this id
    const loggedUserProfile = id == 'user';

    const [showProfileSettings, setShowProfileSettings] = useState<boolean>(false);
    const [showCompetencesSettings, setShowCompetencesSettings] = useState<boolean>(false);

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
                    <ProfileCompetences competences={['', '', '']} loggedUserProfile={loggedUserProfile} editModalHelper={{shouldRender: showCompetencesSettings, onClickOutside: toggleCompetencesSettings}}/>
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

            {
                showCompetencesSettings &&
                <Modal onClickOutside={toggleCompetencesSettings}>
                    <CompetencesSettings
                        // todo: Competences levels from API
                        levels={[
                            { apiValue: 0, name: 'Nenhum' },
                            { apiValue: 1, name: 'Iniciante' },
                            { apiValue: 2, name: 'Experiente' },
                            { apiValue: 3, name: 'Master' },
                        ]}

                        // todo: Competences from API
                        competences={[
                            {apiValue: 'javascript', level: 1, name: 'JavaScript'},
                            {apiValue: 'python',     level: 3,    name: 'Python'},
                            {apiValue: 'java',       level: 2,    name: 'Java'},
                        ]}
                    />
                </Modal>
            }
        </div>
    );

    function toggleProfileSettings() {
        setShowProfileSettings(!showProfileSettings);
    }

    function toggleCompetencesSettings() {
        setShowCompetencesSettings(!showCompetencesSettings);
    }
}
