import { MouseEventHandler, MouseEvent, useContext } from 'react';
import { ProfileContext, ProfileContextType } from '@/pages/Profile'
import { LevelToLabel, LevelToNumber } from '@/types/Competence';
import EditIcon from "@/assets/icons/edit-2.svg"
import './ProfileCompetences.css'

export type ProfileCompetencesProps = {
    onClickEdit:          MouseEventHandler;
    updateProfileContext: (pc: ProfileContextType) => any;
};

const MAX_COMPETENCE_LEVEL = 4;

export function ProfileCompetences(props: ProfileCompetencesProps) {
    const profileContext = useContext(ProfileContext);
    if (profileContext === null)
        return null;

    const sortedCompetences = [...profileContext.profileListData.competences]
        .sort(c => -new Date(c.creationDate).getTime());

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
                    ? sortedCompetences.map(competence => {
                        return (
                            <div className="competence-item" key={competence.id}>
                                {/* todo: fix competence icon */}
                                {
                                    !profileContext.accessingLoggedUser ? null :
                                        <button className="edit-competence" data-competence-edit-id={competence.id} onClick={editCompetence} title="Editar competência">
                                            <img src={EditIcon} />
                                        </button>
                                }
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

    function editCompetence(e: MouseEvent<HTMLElement>) {
        if (profileContext === null)
            return;

        const competenceId = parseInt(e.currentTarget.getAttribute("data-competence-edit-id") as string);
        const competence = profileContext.profileListData.competences.find(c => c.id === competenceId) ?? null;
        props.updateProfileContext({
            ...profileContext,
            editCompetence: competence,
        });

        props.onClickEdit(e);
    }
}
