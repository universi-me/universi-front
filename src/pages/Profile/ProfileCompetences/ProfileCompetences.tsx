import { MouseEventHandler, MouseEvent, useContext, useMemo } from 'react';
import { ProfileContext, ProfileContextType } from '@/pages/Profile'
import { LevelToLabel} from '@/types/Competence';
import { ICON_EDIT_BLACK } from '@/utils/assets';
import './ProfileCompetences.css'

export type ProfileCompetencesProps = {
    openCompetenceSettings: MouseEventHandler;
    updateProfileContext:   (pc: ProfileContextType) => any;
};

const MAX_COMPETENCE_LEVEL = 4;

export function ProfileCompetences(props: ProfileCompetencesProps) {
    const profileContext = useContext(ProfileContext);
    const sortedCompetences = [...(profileContext?.profileListData.competences ?? [])]
        .sort((c1, c2) => new Date(c1.creationDate).getTime() - new Date(c2.creationDate).getTime());

    if (profileContext === null)
        return null;

    return (
        <div className="competences">
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
                                    <button className="edit-competence" data-competence-edit-id={competence.id} onClick={editCompetence} title="Editar competência">
                                            <img src={ICON_EDIT_BLACK} />
                                        </button>
                                }
                                {/* todo: fix competence icon */}
                                <h4 className="competence-type">{competence.competenceType.name}</h4>
                                <h4 className="learning">{competence.description}</h4>
                                <div className="level-container">
                                    <h2 className="level-label">{LevelToLabel[competence.level]}</h2>
                                    <div className="competence-level-list">
                                        {
                                            Array.apply(null, Array(MAX_COMPETENCE_LEVEL)).map((_, i) => {
                                                // todo: current level from API
                                                const learnedLevel = competence.level >= i + 1
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

    function addCompetence(e: MouseEvent<HTMLButtonElement>) {
        if (profileContext === null)
            return;

        props.updateProfileContext({
            ...profileContext,
            editCompetence: null,
        })

        props.openCompetenceSettings(e);
    }

    function editCompetence(e: MouseEvent<HTMLElement>) {
        if (profileContext === null)
            return;

        const competenceId = e.currentTarget.getAttribute("data-competence-edit-id");
        const competence = profileContext.profileListData.competences.find(c => c.id === competenceId) ?? null;
        props.updateProfileContext({
            ...profileContext,
            editCompetence: competence,
        });

        props.openCompetenceSettings(e);
    }
}
