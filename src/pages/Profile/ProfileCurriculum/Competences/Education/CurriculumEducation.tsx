import { useContext, MouseEvent } from 'react';
import { ProfileContext, ProfileContextType } from '@/pages/Profile';
import { ICON_EDIT_BLACK } from '@/utils/assets';
import './CurriculumEducation.css'

export type ProfileEducationProps = {
    openEducationSettings: (e: MouseEvent) => void;
    updateProfileContext: (pc: ProfileContextType) => void;
};

export function CurriculumEducation(props: ProfileEducationProps) {
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

  const addEducation = (e: MouseEvent<HTMLButtonElement>) => {
    props.updateProfileContext({
      ...profileContext,
      editEducation: null,
    });

    props.openEducationSettings(e);
  };

  const editEducation = (e: MouseEvent<HTMLButtonElement>, educationId: string) => {
    const education = profileContext.profileListData.education.find(
      (c) => c.id === educationId
    );

    props.updateProfileContext({
      ...profileContext,
      editEducation: education || null,
    });

    props.openEducationSettings(e);
  };

  return (
    <div className="education">
            <div className="heading">
                Formação Acadêmica
                {
                    profileContext.accessingLoggedUser ?
                        <button className="edit-button" onClick={addEducation}>
                            <i className="bi bi-plus-circle-fill" />
                        </button>
                    : null
                }
            </div>
            <div className="education-list">
                {
                    profileContext.profileListData.education && profileContext.profileListData.education.length > 0
                    ? sortedEducation.map(education => {
                        return (
                            <div className="education-item" key={education.id}>
                                {
                                    !profileContext.accessingLoggedUser ? null :
                                    <button
                                        className="edit-education"
                                        onClick={(e) => editEducation(e, education.id)}
                                        title="Editar competência"
                                    >
                                        <img src={ICON_EDIT_BLACK} />
                                    </button>
                                }
                                <h4 className="education-type">{education.typeEducation.name}</h4>
                                <h4 className="learning">{education.institution.name}</h4>
                                <h4 className="learning">{education.startDate}</h4>
                                {
                                  education.presentDate ? (
                                    <h4 className="learning">{education.presentDate}</h4>
                                  ) : true}
                                <h4 className="learning">{education.endDate}</h4>
                            </div>
                        );
                    })
                    : <p className="empty-educations">Nenhuma Formação cadastrada.</p>
                }
            </div>
        </div>
  );
}