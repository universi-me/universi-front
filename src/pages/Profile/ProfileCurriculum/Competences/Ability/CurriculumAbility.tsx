import { useContext, MouseEvent } from 'react';
import { ProfileContext, ProfileContextType } from '@/pages/Profile';
import { LevelToLabel, LevelToNumber } from '@/types/Competence';
import { ICON_EDIT_BLACK } from '@/utils/assets';
import './CurriculumAbility.css'

export type ProfileCompetencesProps = {
  openCompetenceSettings: (e: MouseEvent) => void;
  updateProfileContext: (pc: ProfileContextType) => void;
};

const MAX_COMPETENCE_LEVEL = 4;

export function CurriculumAbility(props: ProfileCompetencesProps) {
  const profileContext = useContext(ProfileContext);

  if (profileContext === null) {
    return null;
  }

  const sortedCompetences = profileContext.profileListData.competences.sort(
    (c1, c2) =>
      new Date(c1.creationDate).getTime() - new Date(c2.creationDate).getTime()
  );

  const addCompetence = (e: MouseEvent<HTMLButtonElement>) => {
    props.updateProfileContext({
      ...profileContext,
      editCompetence: null,
    });

    props.openCompetenceSettings(e);
  };

  const editCompetence = (e: MouseEvent<HTMLButtonElement>, competenceId: string) => {
    const competence = profileContext.profileListData.competences.find(
      (c) => c.id === competenceId
    );

    props.updateProfileContext({
      ...profileContext,
      editCompetence: competence || null,
    });

    props.openCompetenceSettings(e);
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
                {
                    profileContext.profileListData.competences.length > 0
                    ? sortedCompetences.map(competence => {
                        return (
                            <div className="competence-item" key={competence.id}>
                                {
                                    !profileContext.accessingLoggedUser ? null :
                                    <button
                                        className="edit-competence"
                                        onClick={(e) => editCompetence(e, competence.id)}
                                        title="Editar competência"
                                    >
                                        <img src={ICON_EDIT_BLACK} />
                                    </button>
                                }
                                <h4 className="competence-type">{competence.competenceType.name}</h4>
                                <h4 className="learning">{competence.description}</h4>
                                <div className="level-container">
                                    <h2 className="level-label">{LevelToLabel[competence.level]}</h2>
                                    <div className="competence-level-list">
                                        {
                                            Array.apply(null, Array(MAX_COMPETENCE_LEVEL)).map((_, i) => {
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
