import { useContext, MouseEvent, useState } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { ICON_DELETE_BLACK, ICON_EDIT_BLACK } from '@/utils/assets';
import './CurriculumEducation.css'
import UniversimeApi from '@/services/UniversimeApi';
import * as SwalUtils from "@/utils/sweetalertUtils";

export function CurriculumEducation() {
    const profileContext = useContext(ProfileContext);

  if (profileContext === null) {
    return null;
  }

  const sortedEducation = profileContext.profileListData.education
  ? [...profileContext.profileListData.education].sort(
      (c1, c2) =>
        new Date(c1.creationDate).getTime() -
        new Date(c2.creationDate).getTime()
    )
  : [];

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const addEducation = (e: MouseEvent<HTMLButtonElement>) => {
    profileContext.setEditEducation(null);
  };

  const deleteEducation = (educationId: string) => {
    SwalUtils.fireModal({
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "var(--alert-color)",

        title : "Excluir formação?",
        text: "Tem certeza? Esta ação é irreversível", 
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
    }).then(response => {
        if (!response.isConfirmed)
            return;

        UniversimeApi.Education.remove({ educationId })
        .then((response) => {
            if (!response.success) {
                throw new Error(response.message);
            } else {
              profileContext.reloadPage();
            }
        })
        .catch((reason: Error) => {
            SwalUtils.fireModal({
                title: "Erro ao remover a Formação",
                text: reason.message,
                icon: "error",
            });
        });
    })
  
  };

  return (
    <div className="education">
      <div className="heading">
        Formações Acadêmicas
        {profileContext.accessingLoggedUser ? (
          <button className="add-button" onClick={addEducation}>
            Adicionar Formação
            <div className="icon-button">
              <i className="bi bi-plus-circle-fill" />
            </div>
          </button>
        ) : null}
        { profileContext.accessingLoggedUser &&
            <button onClick={toggleEditing} className={`edit-button ${isEditing ? 'active' : ''}`}>
            <div className={`icon-edit ${isEditing ? 'active' : ''}`}>
                <i className="bi bi-pencil-fill" />
            </div>
            </button>
        }
      </div>
      <div className="education-list">
        {profileContext.profileListData.education &&
        profileContext.profileListData.education.length > 0 ? (
          sortedEducation.map((education) => {
            return (
              <div className="education-item" key={education.id}>
                <div className="education-presentation">
                  <h4 className="education-type">{education.typeEducation.name}</h4>
                  <h4 className="learning">{education.institution.name}</h4>
                </div>
                <div className="direction-dateStart">
                  <h4 className="title-date">Data de Inicio</h4>
                  <h4 className="learning education-date">{education.startDate}</h4>
                </div>
                <div className="direction-dateEnd">
                  <h4 className="title-date">Data de Término</h4>
                  <h4 className="learning education-date">
                    {education.endDate === '0002-11-30'
                      ? (education.presentDate = 'Atuando')
                      : education.endDate}
                  </h4>
                </div>
                {isEditing ? (
                        <div className="config-button-education">
                            <button
                                className="config-button-icon"
                                onClick={() => deleteEducation(education.id)}
                                title="Configurações"
                                >
                                <img src={ICON_DELETE_BLACK} />
                            </button>
                        </div>
                    ) : null}
              </div>
            );
          })
        ) : (
          <p className="empty-educations">Nenhuma formação acadêmica cadastrada.</p>
        )}
      </div>
    </div>
  );
}