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
import type { Group } from "@/types/Group";

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

    useEffect(() => { loadAccessedUser() }, [])
    console.dir(profileContext)

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
                    <ProfileCompetences onClickEdit={()=>{setShowCompetencesSettings(true)}}/>
                    <ProfileLastRecommendations />
                </div>
            </div>

            {
                showProfileSettings &&
                <Modal>
                    <ProfileSettings
                        cancelChanges={() => {setShowDiscardChanges(true)}}
                        toggleModal={setShowProfileSettings}
                    />
                </Modal>
            }

            {
                showCompetencesSettings &&
                <Modal>
                    <CompetencesSettings
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

    async function loadAccessedUser() {
        const [competenceRes, profileRes] = await Promise.all([
            UniversimeApi.Competence.list(),
            UniversimeApi.Profile.get(undefined, id)
        ]);

        const profileListData = await loadProfileListData(profileRes.body.profile.id);

        setProfileContext({
            accessingLoggedUser: id == auth.user?.name,
            profile: profileRes.body.profile,
            allCompetences: competenceRes.body.lista,
            profileListData: profileListData,

            reloadPage: loadAccessedUser,
        });

        discardChanges();
    }

    async function loadProfileListData(profileId: number) {
        const [groupsResponse, competencesResponse] = await Promise.all([
            UniversimeApi.Profile.groups(profileId),
            UniversimeApi.Profile.competences(profileId),
        ]);

        return {
            groups: groupsResponse.body.groups,
            competences: competencesResponse.body.competences,
            links: [],
            recommendationsSend: [],
            recommendationsReceived: [],
        };
    }
}
