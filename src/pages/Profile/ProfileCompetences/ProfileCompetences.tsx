import { ModalHelper } from '@/components/Modal/Modal';
import './ProfileCompetences.css'

export type ProfileCompetencesProps = {
    competences: string[];
    loggedUserProfile: boolean;
    editModalHelper: ModalHelper;
};

export function ProfileCompetences(props: ProfileCompetencesProps) {
    const maxCompetenceLevel = 3;

    return (
        <div className="competences">
            <div className="heading">
                Habilidades
                {
                    props.loggedUserProfile ?
                        <button className="edit-button" onClick={props.editModalHelper.onClickOutside}
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
                    props.competences.map(competence => {
                        return (
                            <div className="competence-item">
                                {/* todo: icon from API */}
                                <img src={`/assets/icons/${"javascript"}.svg`} alt={""} className="icon" />
                                {/* todo: learning from API */}
                                <h4 className="learning">Aprendi durante a minha formação</h4>
                                <div className="competence-level-list">
                                    {
                                        Array.apply(null, Array(maxCompetenceLevel)).map((_, i) => {
                                            // todo: current level from API
                                            const currentLevel = 2;
                                            const learnedLevel = currentLevel >= i + 1
                                                ? 'learned'
                                                : '';

                                            return (
                                                <div className={`competence-level ${learnedLevel}`} />
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}