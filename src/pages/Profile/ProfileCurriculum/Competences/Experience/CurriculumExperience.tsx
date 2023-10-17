import { useContext, MouseEvent, useState } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { ICON_DELETE_BLACK, ICON_EDIT_BLACK } from '@/utils/assets';
import './CurriculumExperience.css'
import { remove } from '@/services/UniversimeApi/Experience';
import * as SwalUtils from "@/utils/sweetalertUtils";

export type ProfileExperienceProps = {
    openExperienceSettings: (e: MouseEvent) => void;
};

export function CurriculumExperience(props: ProfileExperienceProps) {
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const toggleMenu = (experienceId: string) => {
    setSelectedExperienceId(experienceId);
    setMenuOpen(!menuOpen);
  };

  const addExperience = (e: MouseEvent<HTMLButtonElement>) => {
    profileContext.setEditExperience(null);
    props.openExperienceSettings(e);
  };

  const editExperience = (e: MouseEvent<HTMLButtonElement>, experienceId: string) => {
    const experience = profileContext.profileListData.experience.find(
      (c) => c.id === experienceId
    );

    profileContext.setEditExperience(experience ?? null);
    props.openExperienceSettings(e);
  };

  const deleteExperience = (profileExperienceId: string) => {
    setDeleteConfirmation(false);
    setSelectedExperienceId('');
  
    remove({ profileExperienceId })
    .then((response) => {
      console.log(profileExperienceId)
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
    <div className="experience">
      <div className="heading">
        Experiência
        {profileContext.accessingLoggedUser ? (
          <button className="edit-button" onClick={addExperience}>
            <i className="bi bi-plus-circle-fill" />
          </button>
        ) : null}
      </div>
      <div className="experience-list">
        {profileContext.profileListData.experience &&
        profileContext.profileListData.experience.length > 0 ? (
          sortedExperience.map((experience) => {
            return (
              <div className="experience-item" key={experience.id}>
                {profileContext.accessingLoggedUser ? (
                  <div className="config-button">
                    <button
                      className="config-button-icon"
                      onClick={() => toggleMenu(experience.id)}
                      title="Configurações"
                    >
                      <img src="/assets/icons/settings.svg" />
                    </button>
                    {menuOpen && selectedExperienceId === experience.id ? (
                      <div className="config-menu">
                        <button onClick={(e) => editExperience(e, experience.id)}>
                          <img src={ICON_EDIT_BLACK} />
                        </button>
                        <button onClick={() => deleteExperience(experience.id)}>
                        <img src={ICON_DELETE_BLACK} />
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className="experience-presentation">
                  <h4 className="experience-type">{experience.typeExperience.name}</h4>
                  <h4 className="learning">{experience.local}</h4>
                </div>
                <div className="direction-dateStart">
                  <h4 className="title-date">Data de Inicio</h4>
                  <h4 className="learning experience-date">{experience.startDate}</h4>
                </div>
                <div className="direction-dateEnd">
                  <h4 className="title">Data de Término</h4>
                  <h4 className="learning experience-date">
                    {experience.endDate === '0002-11-30'
                      ? (experience.presentDate = 'Atuando')
                      : experience.endDate}
                  </h4>
                </div>
                <div>
                </div>
                <div className="direction-description">
                  <h4 className="title">Descrição</h4>
                  <h4 className="learning description-text">{experience.description}</h4>
                </div>
              </div>
            );
          })
        ) : (
          <p className="empty-experiences">Nenhuma Experiência cadastrada.</p>
        )}
      </div>
    </div>
  );
}