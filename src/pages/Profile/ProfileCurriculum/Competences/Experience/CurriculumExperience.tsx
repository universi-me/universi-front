import { useContext, MouseEvent, useState } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { ICON_DELETE_BLACK, ICON_EDIT_BLACK } from '@/utils/assets';
import './CurriculumExperience.css'
import UniversimeApi from '@/services/UniversimeApi';
import * as SwalUtils from "@/utils/sweetalertUtils";
import { dateWithoutTimezone } from '@/utils/dateUtils';

export function CurriculumExperience() {
    const profileContext = useContext(ProfileContext);

  if (profileContext === null) {
    return null;
  }

  const sortedExperience = profileContext.profileListData.experience
  ? [...profileContext.profileListData.experience].sort(
      (c1, c2) =>
        new Date(c1.creationDate).getTime() -
        new Date(c2.creationDate).getTime()
    )
  : [];

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const addExperience = (e: MouseEvent<HTMLButtonElement>) => {
    profileContext.setEditExperience(null);
  };

  const editExperience = (experience: any) => {
    profileContext.setEditExperience(experience);
  };

  const deleteExperience = (profileExperienceId: string) => {
    SwalUtils.fireModal({
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "var(--alert-color)",

        title : "Excluir experiência?",
        text: "Tem certeza? Esta ação é irreversível", 
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
    }).then(response => {
        if (!response.isConfirmed)
            return;

        UniversimeApi.Experience.remove({ profileExperienceId })
        .then((response) => {
            console.log(profileExperienceId)
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

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = dateWithoutTimezone(dateString).toLocaleDateString("pt-BR");
    return formattedDate;
  };

  return (
    <div className="experience">
      <div className="heading">
        <div className="experience-left-buttons">
          <div className="experience-title">
            Experiências
          </div>
          { profileContext.accessingLoggedUser &&
              <button onClick={toggleEditing} className={`edit-button ${isEditing ? 'active' : ''}`}>
              <div className={`icon-edit ${isEditing ? 'active' : ''}`}>
                  <i className="bi bi-pencil-fill" />
              </div>
              </button>
          }
        </div>
        <div className="experience-right-buttons">
          {profileContext.accessingLoggedUser ? (
            <button className="add-button" onClick={addExperience}>
              Adicionar Experiência
              <div className="icon-button">
                <i className="bi bi-plus-circle-fill" />
              </div>
          </button>
          ) : null}
        </div>
      </div>
      <div className="experience-list">
        {profileContext.profileListData.experience &&
        profileContext.profileListData.experience.length > 0 ? (
          sortedExperience.map((experience) => {
            return (
              <div className="experience-item" key={experience.id}>
                <div className="experience-presentation">
                  <div className="experience-title">
                    <img className="experience-image" src="/assets/icons/experience-black.svg"/>
                    <h4 className="experience-type">{experience.typeExperience.name}</h4>
                  </div>
                  <h4 className="learning experience-local">{experience.local}</h4>
                </div>
                <div className="direction-dateStart">
                  <h4 className="title-date">Data de Inicio</h4>
                  <h4 className="learning experience-date">{ formatDate(experience.startDate)}</h4>
                </div>
                <div className="direction-dateEnd">
                  <h4 className="title">Data de Término</h4>
                  <h4 className="learning experience-date">
                    {
                      experience.presentDate ? 'Atuando' : experience.endDate !== null ? formatDate(experience.endDate) : 'Data não disponível'
                    }
                  </h4>
                </div>
                <div className="direction-description">
                  <h4 className="title">Descrição</h4>
                  <h4 className="learning description-text">{experience.description}</h4>
                </div>
                {isEditing ? (
                        <div className="config-button-experience">
                            <button
                                className="config-button-icon"
                                onClick={() => deleteExperience(experience.id)}
                                title="Apagar"
                                >
                                <img src={ICON_DELETE_BLACK} />
                            </button>
                            <button
                                className="config-button-icon"
                                onClick={() => editExperience(experience)}
                                title="Editar"
                                >
                                <i className="bi bi-pencil-fill" />
                            </button>
                        </div>
                    ) : null}
              </div>
            );
          })
        ) : (
          <p className="empty-experiences">Nenhuma experiência cadastrada.</p>
        )}
      </div>
    </div>
  );
}