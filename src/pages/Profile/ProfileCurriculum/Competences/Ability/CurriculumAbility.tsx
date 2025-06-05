import { useContext, MouseEvent, useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ProfileContext } from '@/pages/Profile';
import { compareCompetences, CompetenceLevelObjects } from '@/types/Competence';
import { ICON_DELETE_BLACK } from '@/utils/assets';
import './CurriculumAbility.css';
import { UniversimeApi } from "@/services"
import * as SwalUtils from "@/utils/sweetalertUtils";
import { IconVerificated } from '@/components/UniversiSvg';
import BootstrapIcon from '@/components/BootstrapIcon';
import styles from "./CurriculumAbility.module.less";

export function CurriculumAbility() {
  const profileContext = useContext(ProfileContext);
  const [isEditing, setIsEditing] = useState(false);

  if (profileContext === null) {
    return null;
  }

  // get list badges earned list unique from all profileContext.activities.badges
  function getBadgedCompetences(): Competence.DTO[] | undefined {
    if (profileContext === null || profileContext.profileListData?.activities == null || profileContext.profileListData.activities.length === 0)
        return [];

    return profileContext.profileListData.activities
        .flatMap(activity => 
            (activity.badges ?? [])
            .map(badge => ({ activity, badge })))
            .filter((item, index, self) => self.findIndex(b => b.badge.id === item.badge.id) === index)
            .map(({ activity, badge }) => ({
                id: activity.id,
                description: activity.name,
                creationDate: activity.startDate,
                hasBadge: true,
                competenceType: {
                    id: badge.id,
                    name: badge.name,
                    reviewed: true,
                },
                level: 0,
                } as Competence.DTO)
            );
}

  const sortedCompetences = [ ...profileContext.profileListData.competences ]
    .sort( compareCompetences );

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
        confirmButtonColor: "var(--font-color-alert)",

        title : "Excluir competência?",
        text: "Tem certeza? Esta ação é irreversível", 
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
    }).then(response => {
        if (!response.isConfirmed)
            return;

        UniversimeApi.Competence.remove( competenceId )
        .then((response) => {
            if (!response.isSuccess()) {
                throw new Error(response.errorMessage);
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

  function calculateWidth(level: Competence.Level) {
    return 25*(level+1)
  };
  

  return (
    <div className="competence">
            <div className="heading">
                <div className="competence-left-buttons">
                    <div className="competence-title">
                        Competências
                    </div>
                    { profileContext.accessingLoggedUser &&
                        <button onClick={toggleEditing} className={`edit-button ${isEditing ? 'active' : ''}`}>
                            <div className={`icon-edit ${isEditing ? 'active' : ''}`}>
                                <i className="bi bi-pencil-fill" />
                            </div>
                        </button>
                    }
                </div>
                <div className="competence-right-buttons">
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
                </div>
            </div>
            <div className="competence-list">
                    {sortedCompetences.length > 0
                        ? sortedCompetences.map((competence) => {
                            return (
                                <div className="competence-item" key={competence.id}>

                                <div className="competence-initial">
                                    { competence.hasBadge &&
                                        <IconVerificated className='competence-badge' title={(profileContext.profile.user.ownerOfSession ? "Você" : profileContext.profile.firstname) + " possui um selo nesta competência"} />
                                    }
                                    <h4 className="competence-type">{competence.competenceType.name}</h4>
                                    { competence.competenceType.reviewed ||
                                        <i className="bi bi-exclamation-diamond-fill unreviewed-competence-warning" title="Esta competência não foi revisada por um administrador e não é visível publicamente"/>
                                    }
                                    { competence.activities.length > 0 && <Tooltip.Provider>
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <BootstrapIcon icon="award-fill" className={styles.activity_trigger}/>
                                            </Tooltip.Trigger>
                                            <Tooltip.Portal>
                                                <Tooltip.Content className={styles.activity_tooltip}>
                                                    <span className={ styles.activity_header }>Atividades relacionadas</span>
                                                    <ul className={styles.activity_list}>
                                                        { competence.activities.map( a => <li key={ a.id } className={ styles.activity_name }>{ a.name }</li> ) }
                                                    </ul>
                                                </Tooltip.Content>
                                            </Tooltip.Portal>
                                        </Tooltip.Root>
                                    </Tooltip.Provider> }
                                </div>
                                { competence.hasBadge ?
                                    <div className="level-container">
                                        <h2 className="level-label"><i className="bi bi-award-fill competence-badge"></i>Competência Conquistada</h2>
                                        <div >
                                            <div className="level-label">{ competence.description }</div>
                                        </div>
                                    </div>
                                :
                                    <div className="level-container">
                                        <h2 className="level-label">{CompetenceLevelObjects[competence.level].label}</h2>
                                        <div className="level-bar">
                                            <div className="bar" style={{ width: `${calculateWidth(competence.level)}%` }}></div>
                                        </div>
                                    </div>
                                }
                    {isEditing && !competence.hasBadge ? (
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
