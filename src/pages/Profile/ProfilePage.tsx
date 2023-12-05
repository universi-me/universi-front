import { Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useMemo } from "react";

import {
    ProfileRecommendSettingsButton,
    ProfileSettings, CompetencesSettings, ProfileDiscardChanges, ProfileContext,
    type ProfileContextType, type ProfilePageLoaderResponse
} from '@/pages/Profile';
import { ProfileInfo } from "@/components/ProfileInfo/ProfileInfo";
import { UniversiModal } from "@/components/UniversiModal";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { AuthContext } from "@/contexts/Auth";
import { SelectionBar } from "./SelectionBar/SelectionBar";

import './Profile.css';

export function ProfilePage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const loaderData = useLoaderData() as ProfilePageLoaderResponse;

    const [showProfileSettings, setShowProfileSettings] = useState<boolean>(false);
    const [showCompetencesSettings, setShowCompetencesSettings] = useState<boolean>(false);
    const [showDiscardChanges, setShowDiscardChanges] = useState<boolean>(false);

    const profileContext = useMemo<ProfileContextType>(() => ({
        accessingLoggedUser:            loaderData.accessingLoggedUser,
        allTypeCompetence:              loaderData.allTypeCompetence,
        allInstitution:                 loaderData.allInstitution,
        allTypeEducation:               loaderData.allTypeEducation,
        allTypeExperience:              loaderData.allTypeExperience,
        
        profile:             loaderData.profile!,
        profileListData: {
            achievements:               loaderData.profileListData.achievements,
            competences:                loaderData.profileListData.competences,
            education:                  loaderData.profileListData.education,
            experience:                 loaderData.profileListData.experience,
            folders:                    loaderData.profileListData.folders,
            groups:                     loaderData.profileListData.groups,
            links:                      loaderData.profileListData.links,
            recommendationsReceived:    loaderData.profileListData.recommendationsReceived,
            recommendationsSend:        loaderData.profileListData.recommendationsSend,
        },

        reloadPage: () => {navigate(location.href)},
    } as any), [loaderData]);

    useEffect(() => {
        if (auth.user === null) {
            navigate('/login');
        }
    }, [auth.user]);

    if (!profileContext)
        return null;

    if (!loaderData.profile || profileContext.profile.user.needProfile) {
        if (loaderData.profile?.user.ownerOfSession) {
            return <Navigate to="/manage-profile"/>
        }

        SwalUtils.fireModal({
            title: "Erro ao acessar perfil",
            text: "Esse usuário não criou seu perfil ainda",
            confirmButtonText: "Voltar",
        }).then(_ => navigate(-1));
        return null;
    }

    return (
        <ProfileContext.Provider value={profileContext} >
        <div id="profile-page">
            <ProfileInfo className="content" profile={profileContext.profile}
                links={profileContext.profileListData.links} organization={auth.organization}
            >
                <SelectionBar/>
                <ProfileRecommendSettingsButton />
            </ProfileInfo>

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
}
