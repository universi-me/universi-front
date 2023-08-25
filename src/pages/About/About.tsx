
import { useState } from 'react';
import './About.css';
import teamMembers from './teamMember';

export const About = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesToShow = 5;

    const goNextSlide = () => {
        const nextIndex = (currentIndex + 1) % teamMembers.length;
        setCurrentIndex(nextIndex);
    }
      
    const goPreviousSlide = () => {
        const nextIndex = (currentIndex - 1 + teamMembers.length) % teamMembers.length;
        setCurrentIndex(nextIndex);
    }

    const extendedTeamMembers = teamMembers.concat(teamMembers.slice(0, slidesToShow - 1));

    return (
      <div className='container'>

        <div className='highPartOne'>

          <div className='text'>
            <span>UMA EQUIPE DE OUTRO UNIVERSO!</span>
            <p>
              Lorem ipsum dolor sit amet. Et accusantium quia ut iste quasi et
              galisum voluptas non accusantium dolore sit culpa unde eum.
            </p>
          </div>

        </div>

        <div className='highPartTwo'>
            <img src='public/assets/imgs/New_team_members.svg' alt='equipe' />
        </div>

        <div className='carousel'>
            <div className='buttons'>
                <button id='left' onClick={goPreviousSlide}>
                    <img src=".\public\assets\icons\chevron-down-1.svg" alt="esquerda" />
                </button>
            </div>
            <div className='profile-container'>
                {extendedTeamMembers
                .slice(currentIndex, currentIndex + slidesToShow)
                .map((member, index) => (
                <div className='profile' key={index}>

                    <div className='header'>
                        <div className='dot'>
                            <div id='redDot'></div>
                            <div id='yellowDot'></div>
                            <div id='greenDot'></div>
                        </div>
                    </div>

                    <div className='profilePic'>
                        <img src= {member.profilePic} alt="" />
                    </div>

                    <div className='socialMedia'>
                        <a id = 'github' href={member.socialMedia.github} target="_blank">
                            <img src={"public/assets/icons/githubwhite.svg"} alt="github" />
                        </a>
                        <a id='instagram' href={member.socialMedia.instagram} target="_blank">
                            <img src="public/assets/icons/instagram.svg" alt="instagram" />
                        </a>
                        <a id= 'linkedin' href={member.socialMedia.linkedin} target="_blank">
                            <img src="public/assets/icons/linkedin.svg" alt="linkedin" />
                        </a>
                    </div>

                    <div className='info'>
                        <span className='name'> 
                            {member.name}
                        </span>

                        <span className='role'>
                            {member.role}
                        </span>
                    </div>

                </div>
        ))}
        </div>
        <div className='buttons'>
            <button id='right' onClick={goNextSlide}>
                <img src=".\public\assets\icons\chevron-down-1.svg" alt="direita" />
            </button>
        </div>

        </div>
        
      </div>
    );
  };