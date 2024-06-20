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

    if (!profileContext)
        return null;

    const showCompetencesSettings = profileContext.editCompetence !== undefined;
    const showEducationSettings = profileContext.editEducation !== undefined;
    const showExperienceSettings = profileContext.editExperience !== undefined;

    return (
        <>
            <div className="curriculum-panel">
                <div className="curriculum-title">
                    <h1 className="curriculum-name">Informações Profissionais</h1>
                </div>

                <div id="item-competence">
                    <CurriculumAbility />
                </div>

                <div id="item-competence">
                    <CurriculumExperience />
                </div>

                <div id="item-competence">
                    <CurriculumEducation />
                </div>
            </div>

        {
            showCompetencesSettings &&
            <CompetencesSettings />
        }

        {
            showEducationSettings &&
            <EducationSettings />
        }

        {
            showExperienceSettings &&
            <ExperienceSettings />
        }
    </>
    );
}

