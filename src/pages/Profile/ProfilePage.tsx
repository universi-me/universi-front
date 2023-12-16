import { Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import {
    ProfileRecommendSettingsButton,
    ProfileSettings, CompetencesSettings, ProfileDiscardChanges, ProfileContext,
    type ProfileContextType, type ProfilePageLoaderResponse, fetchProfilePageData
} from '@/pages/Profile';
import { ProfileInfo } from "@/components/ProfileInfo/ProfileInfo";
import { UniversiModal } from "@/components/UniversiModal";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { AuthContext } from "@/contexts/Auth";
import { SelectionBar } from "./SelectionBar/SelectionBar";

import { ProfileClass } from "@/types/Profile";
import './Profile.css';

export function ProfilePage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const loaderData = useLoaderData() as ProfilePageLoaderResponse;

    const [showProfileSettings, setShowProfileSettings] = useState<boolean>(false);
    const [showCompetencesSettings, setShowCompetencesSettings] = useState<boolean>(false);
    const [showDiscardChanges, setShowDiscardChanges] = useState<boolean>(false);

    const [profileContext, setProfileContext] = useState<ProfileContextType>(makeContext(loaderData));
    useEffect(() => setProfileContext(makeContext(loaderData)), [ loaderData.profile?.id ]);

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

    async function refreshProfileData() {
        const data = await fetchProfilePageData(auth.user?.name)
        const newContext = makeContext(data);
        setProfileContext(newContext);
        return newContext;
    }

    function makeContext(data: ProfilePageLoaderResponse): NonNullable<ProfileContextType> {
        // some values are using "!" even though they can be undefined

        return {
            accessingLoggedUser: data.accessingLoggedUser,
            allInstitution: data.allInstitution,
            allTypeCompetence: data.allTypeCompetence,
            allTypeEducation: data.allTypeEducation,
            allTypeExperience: data.allTypeExperience,
            profile: data.profile!,
            profileListData: data.profileListData,

            reloadPage: refreshProfileData,

            editCompetence: null,
            editEducation: null,
            editExperience: null,
            setEditCompetence(c) {
                setProfileContext({...this, editCompetence: c});
            },
            setEditEducation(e) {
                setProfileContext({...this, editEducation: e});
            },
            setEditExperience(e) {
                setProfileContext({...this, editExperience: e});
            },
        };
    }
}
