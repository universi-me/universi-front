import { useContext } from "react";
import { ProfileContext } from "../ProfileContext";
import { CompetencesSettings } from "../CompetencesSettings/CompetencesSettings";
import ProfileActivities from "./ProfileActivities";
import { EducationSettings } from "../EducationSettings/EducationSettings";
import { ExperienceSettings } from "../ExperienceSettings/ExperienceSettings";
import ProfileCompetences from "./ProfileCompetences";
import ProfileEducations from "./ProfileEducations";
import ProfileExperiences from "./ProfileExperiences";

import styles from "./ProfileCurriculum.module.less";


export function ProfileCurriculum() {
    const profileContext = useContext(ProfileContext);

    if (!profileContext)
        return null;

    const showCompetencesSettings = profileContext.editCompetence !== undefined;
    const showEducationSettings = profileContext.editEducation !== undefined;
    const showExperienceSettings = profileContext.editExperience !== undefined;

    return (
        <>
            <div className={ styles.panel }>
                <div>
                    <h1 className={ styles.name }>Informações Profissionais</h1>
                </div>

                <ProfileCompetences />
                <ProfileExperiences />
                <ProfileEducations />
                <ProfileActivities />
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

