import { useContext, useState } from "react";
import "./ProfileCurriculum.css";
import ConfigButtonDownload from "./ConfigButtonDownload";
import { CurriculumAbility } from "./Competences/Ability/CurriculumAbility";
import { UniversiModal } from "@/components/UniversiModal";
import { CompetencesSettings } from "../CompetencesSettings/CompetencesSettings";
import { ProfileDiscardChanges } from "../ProfileDiscard/ProfileDiscard";
import { ProfileContext } from "../ProfileContext";
import { CurriculumEducation } from "./Competences/Education/CurriculumEducation";
import { EducationSettings } from "../EducationSettings/EducationSettings";

export function ProfileCurriculum() {
  const profileContext = useContext(ProfileContext);

  const [showCompetencesSettings, setShowCompetencesSettings] = useState<boolean>(false);
  const [showEducationSettings, setShowEducationSetting] = useState<boolean>(false);
  const [showDiscardChanges, setShowDiscardChanges] = useState<boolean>(false);

  if (!profileContext)
    return null;

  const discardChanges = () => {
    setShowCompetencesSettings(false);
    setShowEducationSetting(false);

    profileContext.setEditCompetence(null);
    profileContext.setEditEducation(null);

    setShowDiscardChanges(false);
  };


  return (
    <>
      <div className="curriculum-panel">
        <div className="curriculum-title">
          <h1 className="curriculum-name">Meu Currículo</h1>
          <ConfigButtonDownload />
        </div>

        <div className="item-competence">
          <CurriculumAbility openCompetenceSettings={() => setShowCompetencesSettings(true)} />
        </div>

        <div className="item-competence">
          <CurriculumEducation openEducationSettings={() => setShowEducationSetting(true)} />
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
        (showCompetencesSettings || showEducationSettings) && showDiscardChanges &&
        <UniversiModal>
          <ProfileDiscardChanges onDiscard={discardChanges} onCancel={() => setShowDiscardChanges(false)} />
        </UniversiModal>
      }
    </>
  );
}
