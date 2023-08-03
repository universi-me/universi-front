import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import {
    ProfileBio, ProfileGroups, ProfileAchievements, ProfileRecommendSettingsButton,
    ProfileCompetences, ProfileLastRecommendations, ProfileSettings,
    CompetencesSettings, ProfileDiscardChanges, ProfileContext
} from '@/pages/Profile'
import { Modal } from "@/components/Modal/Modal";
import { AuthContext } from "@/src/contexts/Auth/AuthContext";
import { UniversimeApi } from "@/hooks/UniversimeApi";

import type { ProfileContextType } from '@/pages/Profile'

import './Profile.css'
import './card.css'
import './section.css'

export function ProfilePage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [showProfileSettings, setShowProfileSettings] = useState<boolean>(false);
    const [showCompetencesSettings, setShowCompetencesSettings] = useState<boolean>(false);
    const [showDiscardChanges, setShowDiscardChanges] = useState<boolean>(false);

    const [profileContext, setProfileContext] = useState<ProfileContextType>(null);

    if (auth.user === null) {
        navigate('/login');
    }

    useEffect(loadAccessedUser, [])

    return (
        !profileContext ? null :

        <ProfileContext.Provider value={profileContext} >
        <div id="profile-page">
            {/* todo: color from API */}
            <div id="user-header-bar" style={{background: "#515151"}}>
                {
                    profileContext?.accessingLoggedUser ?
                        <button className="edit-button" >
                            <img src='/assets/icons/edit-1.svg' alt="Editar" />
                        </button>
                    : null
                }
            </ div>

            <div className="content">
                <div id="left-side">
                    <ProfileBio onClickEdit={()=>{setShowProfileSettings(true)}} />
                    <ProfileGroups />

                    {/* todo: achievements from API */}
                    <ProfileAchievements
                        count={0}
                        achievements={['', '', '']}
                    />
                </div>

                <div id="right-side">
                    <ProfileRecommendSettingsButton />
                    <ProfileCompetences loggedUserProfile={profileContext?.accessingLoggedUser ?? false} competences={['', '', '']} onClickEdit={()=>{setShowCompetencesSettings(true)}}/>
                    <ProfileLastRecommendations recommendations={['', '']} />
                </div>
            </div>

            {
                showProfileSettings &&
                <Modal>
                    {/* todo: gender options from API */ }
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
                        cancelChanges={()=>{setShowDiscardChanges(true)}}
                        // todo: save profile settings
                        saveChanges={() => {alert('todo')}}
                    />
                </Modal>
            }

            {
                showCompetencesSettings &&
                <Modal>
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

                        cancelAction={()=>{setShowDiscardChanges(true)}}
                        submitAction={()=>{alert('todo')}}
                    />
                </Modal>
            }

            {
                (showProfileSettings || showCompetencesSettings) && showDiscardChanges &&
                <Modal>
                    <ProfileDiscardChanges
                        onDiscard={discardChanges}
                        onCancel={()=>{setShowDiscardChanges(false);}}
                    />
                </Modal>
            }
        </div>
        </ProfileContext.Provider>
    );

    function discardChanges() {
        setShowCompetencesSettings(false);
        setShowProfileSettings(false);
        setShowDiscardChanges(false);
    }

    function loadAccessedUser() {
        UniversimeApi.ProfileApi.get(undefined, id)
        .then(r => {
            setProfileContext({
                profile: r.body.profile,
                accessingLoggedUser: id == auth.user?.name
            });
            console.dir(r)
        })
    }
}
