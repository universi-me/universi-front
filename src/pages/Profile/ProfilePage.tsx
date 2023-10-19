import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import {
    ProfileBio, ProfileGroups,  ProfileRecommendSettingsButton,
    ProfileSettings, CompetencesSettings, ProfileDiscardChanges, ProfileContext }
from '@/pages/Profile'
import { UniversiModal } from "@/components/UniversiModal";
import * as SwalUtils from "@/utils/sweetalertUtils"
import { AuthContext } from "@/contexts/Auth";
import { UniversimeApi } from "@/services/UniversimeApi";
import type { ProfileContextType } from '@/pages/Profile'
import { SelectionBar } from "./SelectionBar/SelectionBar";

import './Profile.css'

export function ProfilePage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [showProfileSettings, setShowProfileSettings] = useState<boolean>(false);
    const [showCompetencesSettings, setShowCompetencesSettings] = useState<boolean>(false);
    const [showDiscardChanges, setShowDiscardChanges] = useState<boolean>(false);

    const [profileContext, setProfileContext] = useState<ProfileContextType>(null);

    useEffect(() => {
        loadAccessedUser();

        if (auth.user === null) {
            navigate('/login');
        }
    }, [id, auth.user]);

    useEffect(() => {
        const user = profileContext?.profile.user;
        if (user?.needProfile && user.ownerOfSession) {
            navigate("/manage-profile");
        }
    }, [profileContext?.profile.user])

    if (!profileContext)
        return null;

    if (profileContext.profile.user.needProfile) {
        SwalUtils.fireModal({
            title: "Erro ao acessar perfil",
            text: "Esse usuário não criou seu perfil ainda",
        }).then(_ => navigate(-1));
        return null;
    }

    return (
        <ProfileContext.Provider value={profileContext} >
        <div id="profile-page">
            <div className="content">
                <div id="left-side">
                    <ProfileBio profile={profileContext.profile} />
                    <ProfileGroups groups={profileContext.profileListData.groups} />
                </div>

                <div id="right-side">
                    <SelectionBar/>
                    <ProfileRecommendSettingsButton />
                </div>
            </div>

            {
                showProfileSettings &&
                <UniversiModal>
                    <ProfileSettings
                        cancelChanges={() => {setShowDiscardChanges(true)}}
                        toggleModal={setShowProfileSettings}
                    />
                </UniversiModal>
            }

            {
                showCompetencesSettings &&
                <UniversiModal>
                    <CompetencesSettings
                        cancelChanges={()=>{setShowDiscardChanges(true)}}
                    />
                </UniversiModal>
            }

            {
                (showProfileSettings || showCompetencesSettings) && showDiscardChanges &&
                <UniversiModal>
                    <ProfileDiscardChanges
                        onDiscard={discardChanges}
                        onCancel={()=>{setShowDiscardChanges(false);}}
                    />
                </UniversiModal>
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
        const [profileRes, competenceTypeRes] = await Promise.all([
            UniversimeApi.Profile.get({username: id}),
            UniversimeApi.CompetenceType.list(),
        ]);

        if (profileRes.success && profileRes.body?.profile) {
            const profileListData = await loadProfileListData(profileRes.body.profile.id);

            setProfileContext({
                accessingLoggedUser: profileRes.body?.profile.user.ownerOfSession ?? false,
                profile: profileRes.body.profile,
                allCompetenceTypes: competenceTypeRes.body.list,
                profileListData: profileListData,
                editCompetence: null,
    
                reloadPage: loadAccessedUser,
            });

            discardChanges();
        }
    }

    async function loadProfileListData(profileId: string) {
        const [groupsRes, competencesRes, linksRes, recommendationsRes, foldersRes] = await Promise.all([
            UniversimeApi.Profile.groups({profileId}),
            UniversimeApi.Profile.competences({profileId}),
            UniversimeApi.Profile.links({profileId}),
            UniversimeApi.Profile.recommendations({profileId}),
            UniversimeApi.Profile.folders({profileId, assignedOnly: true}),
        ]);

        return {
            groups: groupsRes.body?.groups ?? [],
            competences: competencesRes.body?.competences ?? [],
            links: linksRes.body?.links ?? [],
            recommendationsSend: recommendationsRes.body?.recomendationsSend ?? [],
            recommendationsReceived: recommendationsRes.body?.recomendationsReceived ?? [],
            folders: foldersRes.body?.folders ?? [],
            achievements: [], // todo: fetch achievements
        };
    }
}
