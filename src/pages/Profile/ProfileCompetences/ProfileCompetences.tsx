import { MouseEventHandler, useContext } from 'react';
import { ProfileContext } from '@/pages/Profile'
import './ProfileCompetences.css'
import { LevelToLabel, LevelToNumber } from '@/types/Competence';

export type ProfileCompetencesProps = {
    onClickEdit: MouseEventHandler;
};

const MAX_COMPETENCE_LEVEL = 4;

export function ProfileCompetences(props: ProfileCompetencesProps) {
    const profileContext = useContext(ProfileContext);
    if (profileContext === null)
        return null;

    return (
        <div className="competences">
            <div className="heading">
                Habilidades
                {
                    profileContext.accessingLoggedUser ?
                        <button className="edit-button" onClick={props.onClickEdit}
                            // todo: figure out why the button is bigger than the image
                            style={{translate: '0 3px'}}
                        >
                            <img src='/assets/icons/edit-1.svg' alt="Editar" />
                        </button>
                    : null
                }
            </div>
            <div className="competence-list">
                {
                    profileContext.profileListData.competences.length > 0
                    ? profileContext.profileListData.competences.map(competence => {
                        return (
                            <div className="competence-item" key={competence.id}>
                                {/* todo: fix competence icon */}
                                <img src={`/assets/icons/${competence.competenceType.name}.svg`} alt={""} className="icon" title={competence.competenceType.name} />
                                <h4 className="learning">{competence.description}</h4>
                                <div className="level-container">
                                    <h2 className="level-label">{LevelToLabel[competence.level]}</h2>
                                    <div className="competence-level-list">
                                        {
                                            Array.apply(null, Array(MAX_COMPETENCE_LEVEL)).map((_, i) => {
                                                // todo: current level from API
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