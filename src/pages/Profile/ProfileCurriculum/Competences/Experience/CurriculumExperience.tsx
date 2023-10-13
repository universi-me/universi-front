import { useContext, MouseEvent } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { ICON_EDIT_BLACK } from '@/utils/assets';
import './CurriculumExperience.css'

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

  return (
    <div className="experience">
            <div className="heading">
                Experiência
                {
                    profileContext.accessingLoggedUser ?
                        <button className="edit-button" onClick={addExperience}>
                            <i className="bi bi-plus-circle-fill" />
                        </button>
                    : null
                }
            </div>
            <div className="experience-list">
                {
                    profileContext.profileListData.experience && profileContext.profileListData.experience.length > 0
                    ? sortedExperience.map(experience => {
                        return (
                            <div className="experience-item" key={experience.id}>
                                {
                                    !profileContext.accessingLoggedUser ? null :
                                    <button
                                        className="edit-experience"
                                        onClick={(e) => editExperience(e, experience.id)}
                                        title="Editar experience"
                                    >
                                        <img src={ICON_EDIT_BLACK} />
                                    </button>
                                }
                                <h4 className="experience-type">{experience.typeExperience.name}</h4>
                                <h4 className="learning">{experience.description}</h4>
                                <h4 className="learning">{experience.local}</h4>
                                <h4 className="learning">{experience.startDate}</h4>
                                {
                                  experience.presentDate ? (
                                    <h4 className="learning">{experience.presentDate}</h4>
                                  ) : true}
                                <h4 className="learning">{experience.endDate}</h4>
                            </div>
                        );
                    })
                    : <p className="empty-experience">Nenhuma Experiência cadastrada.</p>
                }
            </div>
        </div>
  );
}