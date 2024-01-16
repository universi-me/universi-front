import { useContext, MouseEvent, useState } from 'react';
import { CompetencesSettings, ProfileContext } from '@/pages/Profile';
import { UniversiModal } from '@/components/UniversiModal';
import { Competence, Level, LevelToLabel} from '@/types/Competence';
import { ICON_DELETE_BLACK, ICON_EDIT_BLACK } from '@/utils/assets';
import './CurriculumAbility.css';
import UniversimeApi from '@/services/UniversimeApi';
import * as SwalUtils from "@/utils/sweetalertUtils";

export function CurriculumAbility() {
  const profileContext = useContext(ProfileContext);

  if (profileContext === null) {
    return null;
  }

  const sortedCompetences = [...profileContext.profileListData.competences]
    .sort((c1, c2) => new Date(c1.creationDate).getTime() - new Date(c2.creationDate).getTime());

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const addCompetence = (e: MouseEvent<HTMLButtonElement>) => {
    profileContext.setEditCompetence(null);
  };

  const editCompetence = (competence: Competence) => {
    profileContext.setEditCompetence(competence);
  };

  const deleteCompetence = (competenceId: string) => {
    SwalUtils.fireModal({
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "var(--alert-color)",

        title : "Excluir competência?",
        text: "Tem certeza? Esta ação é irreversível", 
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
    }).then(response => {
        if (!response.isConfirmed)
            return;

        UniversimeApi.Competence.remove({ competenceId })
        .then((response) => {
            if (!response.success) {
                throw new Error(response.message);
            } else {
                profileContext.reloadPage();
            }
        })
        .catch((reason: Error) => {
            SwalUtils.fireModal({
                title: "Erro ao remover a experiência",
                text: reason.message,
                icon: "error",
            });
        });
    });
  };

  function calculateWidth(level: Level) {
    return 25*(level+1)
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
                { profileContext.accessingLoggedUser &&
                    <button onClick={toggleEditing} className={`edit-button ${isEditing ? 'active' : ''}`}>
                        <div className={`icon-edit ${isEditing ? 'active' : ''}`}>
                            <i className="bi bi-pencil-fill" />
                        </div>
                    </button>
                }
            </div>
            <div className="competence-list">
                    {profileContext.profileListData.competences.length > 0
                        ? sortedCompetences.map((competence) => {
                            return (
                                <div className="competence-item" key={competence.id}>

                                <div className="competece-initial">
                                    <h4 className="competence-type">{competence.competenceType.name}</h4>
                                </div>
                                <div className="level-container">
                                    <h2 className="level-label">{(LevelToLabel)[competence.level]}</h2>
                                    <div className="level-bar">
                                        <div className="bar" style={{ width: `${calculateWidth(competence.level)}%` }}></div>
                                    </div>
                                </div>
                    {isEditing ? (
                        <div className="config-button-ability">
                            <button
                                className="config-button-icon"
                                onClick={() => deleteCompetence(competence.id)}
                                title="Apagar"
                                >
                                <img src={ICON_DELETE_BLACK} />
                            </button>
                            <button
                                className="config-button-icon"
                                onClick={() => editCompetence(competence)}
                                title="Editar"
                                >
                                <i className="bi bi-pencil-fill" />
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
