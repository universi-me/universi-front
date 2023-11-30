import { useContext, MouseEvent, useState } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { LevelToLabel, LevelToNumber } from '@/types/Competence';
import { ICON_DELETE_BLACK, ICON_EDIT_BLACK } from '@/utils/assets';
import './CurriculumAbility.css';
import { remove } from '@/services/UniversimeApi/Competence';
import * as SwalUtils from "@/utils/sweetalertUtils";

export type ProfileCompetencesProps = {
  openCompetenceSettings: (e: MouseEvent) => void;
};

export function CurriculumAbility(props: ProfileCompetencesProps) {
  const profileContext = useContext(ProfileContext);

  if (profileContext === null) {
    return null;
  }

  const sortedCompetences = profileContext.profileListData.competences
    .toSorted((c1, c2) => new Date(c1.creationDate).getTime() - new Date(c2.creationDate).getTime());

  const [selectedCompeteceId, setSelectedCompeteceId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const addCompetence = (e: MouseEvent<HTMLButtonElement>) => {
    profileContext.setEditCompetence;
    props.openCompetenceSettings(e);
  };

  const deleteCompetece = (competenceId: string) => {
    setDeleteConfirmation(false);
    setSelectedCompeteceId('');
  
    remove({ competenceId })
    .then((response) => {
        if (!response.success) {
            throw new Error(response.message);
        } else {
          window.location.reload();
        }
    })
    .catch((reason: Error) => {
        SwalUtils.fireModal({
            title: "Erro ao remover a experiência",
            text: reason.message,
            icon: "error",
        });
    });
  };

  function calculateWidth(level: string) {
    switch (level) {
      case "LEARNING":
        return 10;
      case "BEGINNER":
        return 25;
      case "EXPERIENCED":
        return 50;
      case "VERY_EXPERIENCED":
        return 75;
      case "MASTER":
        return 100;
      default:
        return 0;
    }
  };
  

  return (
    <div className="competence">
            <div className="heading">
                Competências
                {
                    profileContext.accessingLoggedUser ?
                        <button className="add-button" onClick={addCompetence}>
                            Adicionar Competência
                            <div className="icon-button">
                                <i className="bi bi-plus-circle-fill" />
                            </div>
                        </button>
                    : null
                }
                <button onClick={toggleEditing} className={`edit-button ${isEditing ? 'active' : ''}`}>
                    <div className={`icon-edit ${isEditing ? 'active' : ''}`}>
                        <i className="bi bi-pencil-fill" />
                    </div>
                </button>
            </div>
            <div className="competence-list">
                    {profileContext.profileListData.competences.length > 0
                        ? sortedCompetences.map(competence => {
                            return (
                                <div className="competence-item" key={competence.id}>

                                <div className="competece-initial">
                                    <h4 className="competence-type">{competence.competenceType.name}</h4>
                                </div>
                                <div className="level-container">
                                    <h2 className="level-label">{LevelToLabel[competence.level]}</h2>
                                    <div className="level-bar">
                                        <div className="bar" style={{ width: `${calculateWidth(competence.level)}%` }}></div>
                                    </div>
                                </div>
                    {isEditing ? (
                        <div className="config-button-ability">
                            <button
                                className="config-button-icon"
                                onClick={() => deleteCompetece(competence.id)}
                                title="Configurações"
                                >
                                <img src={ICON_DELETE_BLACK} />
                            </button>
                        </div>
                    ) : null}
                        </div>
                        );
                    })
                : <p className="empty-competences">Nenhuma competência cadastrada.</p>
                }
            </div>
        </div>
  );
}
