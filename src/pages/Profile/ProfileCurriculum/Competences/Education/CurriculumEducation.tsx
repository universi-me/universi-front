import { useContext, MouseEvent, useState } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { ICON_DELETE_BLACK, ICON_EDIT_BLACK } from '@/utils/assets';
import './CurriculumEducation.css'
import UniversimeApi from '@/services/UniversimeApi';
import * as SwalUtils from "@/utils/sweetalertUtils";
import { dateWithoutTimezone } from '@/utils/dateUtils';

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

  const editEducation = (education: any) => {
    profileContext.setEditEducation(education);
  };

  const deleteEducation = (educationId: string) => {
    SwalUtils.fireModal({
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "var(--font-color-alert)",

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

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = dateWithoutTimezone(dateString).toLocaleDateString("pt-BR");
    return formattedDate;
  };

  return (
    <div className="education">
      <div className="heading">
        <div className='education-left-buttons'>
          <div className="education-title">
            Formações Acadêmicas
          </div>
          { profileContext.accessingLoggedUser &&
              <button onClick={toggleEditing} className={`edit-button ${isEditing ? 'active' : ''}`}>
              <div className={`icon-edit ${isEditing ? 'active' : ''}`}>
                  <i className="bi bi-pencil-fill" />
              </div>
              </button>
          }
        </div>
        <div className='education-right-buttons'>
          {profileContext.accessingLoggedUser ? (
            <button className="add-button" onClick={addEducation}>
              Adicionar Formação
              <div className="icon-button">
                <i className="bi bi-plus-circle-fill" />
              </div>
            </button>
          ) : null}

        </div>
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
                  <h4 className="learning education-date">{ formatDate(education.startDate) }</h4>
                </div>
                <div className="direction-dateEnd">
                  <h4 className="title-date">Data de Término</h4>
                  <h4 className="learning education-date">
                    {
                      education.presentDate ? 'Atuando' : education.endDate !== null ? formatDate(education.endDate) : 'Data não disponível'
                    }
                  </h4>
                </div>
                {isEditing ? (
                        <div className="config-button-education">
                            <button
                                className="config-button-icon"
                                onClick={() => deleteEducation(education.id)}
                                title="Apagar"
                                >
                                <img src={ICON_DELETE_BLACK} />
                            </button>
                            <button
                                className="config-button-icon"
                                onClick={() => editEducation(education)}
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
          <p className="empty-educations">Nenhuma formação acadêmica cadastrada.</p>
        )}
      </div>
    </div>
  );
}