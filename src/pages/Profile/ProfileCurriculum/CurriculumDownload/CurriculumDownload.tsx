
import { useContext } from "react";
import { ProfileContext } from '@/pages/Profile';
import "./CurriculumDownload.css"
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { getProfileImageUrl } from "@/utils/profileUtils";
import { LevelToLabel } from "@/types/Competence";


function CurriculumDownload() {
    const profileContext = useContext(ProfileContext)

    if (profileContext === null) {
        return null;
      }
    
    const sortedCompetences = profileContext.profileListData.competences
        .toSorted((c1, c2) => new Date(c1.creationDate).getTime() - new Date(c2.creationDate).getTime());
    
    const sortedEducation = profileContext.profileListData.education
        ? [...profileContext.profileListData.education].sort(
            (c1, c2) =>
              new Date(c1.creationDate).getTime() -
              new Date(c2.creationDate).getTime()
          )
        : [];

    const sortedExperience = profileContext.profileListData.experience
        ? [...profileContext.profileListData.experience].sort(
            (c1, c2) =>
              new Date(c1.creationDate).getTime() -
              new Date(c2.creationDate).getTime()
          )
        : [];
    

    return (
        profileContext === null ? null :
        <div className="content-curriculum">
            <div className="perfil-curriculum">
                <div className="header-curriculum">
                    <div id="profile-image-container">
                        <ProfileImage className="perfil-image" imageUrl={getProfileImageUrl(profileContext.profile)} noImageColor="#505050" />
                    </div>
                    <div className="perfil-name">
                        <h2 className="text-title">{ `${profileContext.profile.firstname}` }</h2>
                        <h2 className="text-title">{ `${profileContext.profile.lastname}` }</h2>
                    </div>
                    <div className="perfil-info">
                    <h2 className="text-simple">
                    Gênero: {profileContext.profile.gender === 'M' ? 'Masculino' : profileContext.profile.gender === 'F' ? 'Feminino' : profileContext.profile.gender === 'O' ? 'Outro' : 'Não Definido'}
                    </h2>
                        <div className="text-bio biography">
                        {
                            profileContext.profile.bio === null || profileContext.profile.bio.length === 0
                            ? <p style={{fontStyle: 'italic'}}>Nenhuma bio</p>
                            : <p style={{whiteSpace: 'break-spaces', marginLeft: '8px'}}>{ profileContext.profile.bio }</p>
                        }
                        </div>
                    </div>
                </div>
            </div>
            <div className="body-curriculum">
                <div className="main-title">
                    <div className="element-heading">
                        Habilidades
                    </div>
                    <div className="element-list">
                        {profileContext.profileListData.competences.length > 0
                            ? sortedCompetences.map(competence => {
                                return (
                                    <div className="element-item" key={competence.id}>
                                        <div className="element-initial">
                                            <h4 className="element-type">{competence.competenceType.name}</h4>
                                        </div>
                                        <div className="level-container">
                                            <h2 className="level-label">{LevelToLabel[competence.level]}</h2>
                                        </div>
                                    </div>
                                    );
                                })
                                : <p className="empty-element">Nenhuma Habilidade cadastrada.</p>
                            }
                    </div>
                </div>
                <div className="main-title">
                    <div className="element-heading">
                        Formação Acadêmica
                    </div>
                    <div className="element-list">
                        {profileContext.profileListData.education.length > 0
                            ? sortedEducation.map((education) => {
                                return (
                                    <div className="element-item" key={education.id}>
                                        <div className="element-initial">
                                            <h4 className="element-type">{education.typeEducation.name}</h4>
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
                                    </div>
                                    );
                                })
                                : <p className="empty-element">Nenhuma Formação cadastrada.</p>
                            }
                    </div>
                </div>
                <div className="main-title">
                    <div className="element-heading">
                        Experiência
                    </div>
                    <div className="element-list">
                        {profileContext.profileListData.experience.length > 0
                            ? sortedExperience.map((experience) => {
                                return (
                                    <div className="element-item-experience" key={experience.id}>
                                        <div className="element-initial">
                                            <h4 className="element-type">{experience.typeExperience.name}</h4>
                                            <h4 className="learning">{experience.local}</h4>
                                        </div>
                                        <div className="direction-dateStart">
                                            <h4 className="title-date">Data de Inicio</h4>
                                            <h4 className="learning education-date">{experience.startDate}</h4>
                                        </div>
                                        <div className="direction-dateEnd">
                                            <h4 className="title-date">Data de Término</h4>
                                            <h4 className="learning education-date">
                                                {experience.endDate === '0002-11-30'
                                                ? (experience.presentDate = 'Atuando')
                                                : experience.endDate}
                                            </h4>
                                        </div>
                                        <div className="direction-experience-description">
                                            <h4 className="title">Descrição</h4>
                                            <h4 className="learning description-text">{experience.description}</h4>
                                        </div>
                                    </div>
                                    );
                                })
                                : <p className="empty-element">Nenhuma Experiência cadastrada.</p>
                            }
                    </div>
                </div>
            </div>
        </div>
        
        
    );
}

export default CurriculumDownload;
