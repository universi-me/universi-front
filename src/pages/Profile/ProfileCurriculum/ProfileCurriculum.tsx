import { useContext, useState } from "react";
import { ProfileContext } from "../ProfileContext";
import { CurriculumAbility } from "./Competences/Ability/CurriculumAbility";
import { CurriculumEducation } from "./Competences/Education/CurriculumEducation";
import { UniversiModal } from "@/components/UniversiModal";
import { CompetencesSettings } from "../CompetencesSettings/CompetencesSettings";
import { ProfileDiscardChanges } from "../ProfileDiscard/ProfileDiscard";
import { CurriculumExperience } from "./Competences/Experience/CurriculumExperience";
import "./ProfileCurriculum.css";
import { EducationSettings } from "../EducationSettings/EducationSettings";
import { ExperienceSettings } from "../ExperienceSettings/ExperienceSettings";


export function ProfileCurriculum() {
    const profileContext = useContext(ProfileContext);

    const [showCompetencesSettings, setShowCompetencesSettings] = useState<boolean>(false);
    const [showEducationSettings, setShowEducationSetting] = useState<boolean>(false);
    const [showExperienceSettings, setShowExperienceSetting] = useState<boolean>(false);
    const [showDiscardChanges, setShowDiscardChanges] = useState<boolean>(false);

    if (!profileContext)
        return null;

    const discardChanges = () => {
        setShowCompetencesSettings(false);
        setShowEducationSetting(false);
        setShowExperienceSetting(false);
        
        profileContext.setEditCompetence(null);
        profileContext.setEditEducation(null);
        profileContext.setEditExperience(null);
        
        setShowDiscardChanges(false);
    };

    return (
        <>
            <div className="curriculum-panel">
                <div className="curriculum-title">
                    <h1 className="curriculum-name">Informações Profissionais</h1>
                </div>

                <div id="item-competence">
                    <CurriculumAbility openCompetenceSettings={() => setShowCompetencesSettings(true)} />
                </div>

                <div id="item-competence">
                    <CurriculumEducation openEducationSettings={() => setShowEducationSetting(true)} />
                </div>

                <div id="item-competence">
                    <CurriculumExperience openExperienceSettings={() => setShowExperienceSetting(true)} />
                </div>
            </div>

        {
            showCompetencesSettings &&
            <UniversiModal>
                <CompetencesSettings cancelChanges={() => setShowDiscardChanges(true)} />
            </UniversiModal>
        }

        {
            showEducationSettings &&
            <UniversiModal>
                <EducationSettings cancelChanges={() => setShowDiscardChanges(true)} />
            </UniversiModal>
        }

        {
            showExperienceSettings &&
            <UniversiModal>
                <ExperienceSettings cancelChanges={() => setShowDiscardChanges(true)} />
            </UniversiModal>
        }

        {
            (showCompetencesSettings || showEducationSettings || showExperienceSettings) && showDiscardChanges &&
            <UniversiModal>
            <ProfileDiscardChanges onDiscard={discardChanges} onCancel={() => setShowDiscardChanges(false)} />
            </UniversiModal>
        }
    </>
    );
}

