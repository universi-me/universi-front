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

const MAX_COMPETENCE_LEVEL = 4;

export function CurriculumAbility(props: ProfileCompetencesProps) {
  const profileContext = useContext(ProfileContext);

  if (profileContext === null) {
    return null;
  }

  const sortedCompetences = profileContext.profileListData.competences
    .toSorted((c1, c2) => new Date(c1.creationDate).getTime() - new Date(c2.creationDate).getTime());

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCompeteceId, setSelectedCompeteceId] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const toggleMenu = (experienceId: string) => {
    setSelectedCompeteceId(experienceId);
    setMenuOpen(!menuOpen);
  };

  const addCompetence = (e: MouseEvent<HTMLButtonElement>) => {
    profileContext.setEditCompetence(null);
    props.openCompetenceSettings(e);
  };

  const editCompetence = (e: MouseEvent<HTMLButtonElement>, competenceId: string) => {
    const competence = profileContext.profileListData.competences.find(
      (c) => c.id === competenceId
    );

    profileContext.setEditCompetence(competence ?? null);
    props.openCompetenceSettings(e);
  };

  const deleteCompetece = (competenceId: string) => {
    setDeleteConfirmation(false);
    setSelectedCompeteceId('');
  
    remove({ competenceId })
    .then((response) => {
      console.log(competenceId)
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

  return (
    <div className="competence">
            <div className="heading">
                Habilidades
                {
                    profileContext.accessingLoggedUser ?
                        <button className="edit-button" onClick={addCompetence}>
                            <i className="bi bi-plus-circle-fill" />
                        </button>
                    : null
                }
            </div>
            <div className="competence-list">
                    {profileContext.profileListData.competences.length > 0
                        ? sortedCompetences.map(competence => {
                            return (
                                <div className="competence-item" key={competence.id}>
                                    {profileContext.accessingLoggedUser ? (
                    <div className="config-button">
                        <button
                        className="config-button-icon"
                        onClick={() => toggleMenu(competence.id)}
                        title="Configurações"
                        >
                        <img src="/assets/icons/settings.svg" />
                        </button>
                        {menuOpen && selectedCompeteceId === competence.id ? (
                        <div className="config-menu">
                            <button onClick={(e) => editCompetence(e, competence.id)}>
                            <img src={ICON_EDIT_BLACK} />
                            </button>
                            <button onClick={() => deleteCompetece(competence.id)}>
                            <img src={ICON_DELETE_BLACK} />
                            </button>
                        </div>
                        ) : null}
                    </div>
                    ) : null}
                                <div className="competece-initial">
                                    <h4 className="competence-type">{competence.competenceType.name}</h4>
                                    <h4 className="learning">{competence.description}</h4>
                                </div>
                                <div className="level-container">
                                    <h2 className="level-label">{LevelToLabel[competence.level]}</h2>
                                    <div className="competence-level-list">
                                        {
                                            Array(MAX_COMPETENCE_LEVEL).map((_, i) => {
                                                const learnedLevel = LevelToNumber[competence.level] >= i + 1
                                                    ? 'learned'
                                                    : '';

                                                return (
                                                    <div className={`competence-level ${learnedLevel}`} key={`${competence.id}-${i}`}/>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                    })
                    : <p className="empty-competences">Nenhuma habilidade cadastrada.</p>
                }
            </div>
        </div>
  );
}
