import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProfileCurriculum.css";
import ConfigButtonDownload from "./ConfigButtonDownload";
import { CurriculumAbility } from "./Competences/Ability/CurriculumAbility";
import UniversimeApi from "@/services/UniversimeApi";
import { UniversiModal } from "@/components/UniversiModal";
import { CompetencesSettings } from "../CompetencesSettings/CompetencesSettings";
import { ProfileDiscardChanges } from "../ProfileDiscard/ProfileDiscard";
import { AuthContext } from "@/contexts/Auth";
import { ProfileContextType } from "../ProfileContext";
import { CurriculumEducation } from "./Competences/Education/CurriculumEducation";
import { EducationSettings } from "../EducationSettings/EducationSettings";

export function ProfileCurriculum() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [showCompetencesSettings, setShowCompetencesSettings] = useState<boolean>(
    false
  );
  const [showEducationSettings, setShowEducationSetting] = useState<boolean>(
    false
  );
  const [showDiscardChanges, setShowDiscardChanges] = useState<boolean>(false);
  const [profileContext, setProfileContext] = useState<ProfileContextType>(null);

  useEffect(() => {
    loadAccessedUser();

    if (auth.user === null) {
      navigate("/login");
    }
  }, [id, auth.user]);

  const discardChanges = () => {
    setShowCompetencesSettings(false);
  };

  const loadAccessedUser = async () => {
    try {
      const [profileRes, competenceTypeRes ,EducationRes, TypeEducationRes] = await Promise.all([
        UniversimeApi.Profile.get({ username: id }),
        UniversimeApi.CompetenceType.list(),
        UniversimeApi.TypeEducation.list(),
        UniversimeApi.Education.list(),
        UniversimeApi.Institution.list(),
      ]);

      const profileListData = await loadProfileListData(profileRes.body.id);

      setProfileContext({
        accessingLoggedUser: profileRes.body?.profile.user.ownerOfSession ?? false,
        profile: profileRes.body.profile,
        education: EducationRes.body.lista,
        allCompetenceTypes: competenceTypeRes.body.list,
        profileListData: profileListData,
        editCompetence: null,
        editEducation: null,
        reloadPage: loadAccessedUser,
      });

      discardChanges();
    } catch (error) {
      console.error("Erro ao carregar dados do usuário", error);
    }
  };

  const loadProfileListData = async (profileId: string) => {
    try {
      const [competencesRes, educationRes] = await Promise.all([
        UniversimeApi.Profile.competences({ profileId }),
        UniversimeApi.Profile.educations({ profileId })
      ]);

      return {
        competences: competencesRes.body?.competences,
        education: educationRes.body?.educations,
      };
    } catch (error) {
      console.error("Erro ao carregar dados do perfil", error);
      return {
        competences: [],
        education:   [],
      };
    }
  };

  return (
    <>
      <div className="curriculum-panel">
        <div className="curriculum-title">
          <h1 className="curriculum-name">Meu Currículo</h1>
          <ConfigButtonDownload />
        </div>
        <div className="item-competence">
          <CurriculumAbility
            openCompetenceSettings={() => {
              setShowCompetencesSettings(true);
            }}
            updateProfileContext={setProfileContext}
          />
        </div>
        <div className="item-competence">
          <CurriculumEducation
            openEducationSettings={() => {
              setShowEducationSetting(true);
            }}
            updateProfileContext={setProfileContext}
          />
        </div>
        
      </div>

      {showCompetencesSettings && showEducationSettings && (
        <UniversiModal>
          <CompetencesSettings
            cancelChanges={() => {
              setShowDiscardChanges(true);
            }}
          />
          <EducationSettings
          cancelChanges={() => {
            setShowDiscardChanges(true);
          }}
          />
        </UniversiModal>
      )}

      {showCompetencesSettings && showEducationSettings && showDiscardChanges && (
        <UniversiModal>
          <ProfileDiscardChanges
            onDiscard={discardChanges}
            onCancel={() => {
              setShowDiscardChanges(false);
            }}
          />
        </UniversiModal>
      )}
    </>
  );
}
