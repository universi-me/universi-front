import React from 'react';
import './About.css'

export const About = () => {
  
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

            <div className='profile'>

                <div className='header'>
                    <div className='dot'>
                        <div id='redDot'></div>
                        <div id='yellowDot'></div>
                        <div id='greenDot'></div>
                    </div>
                </div>

                <div className='profilePic'>
                    <img src="https://i.pinimg.com/564x/cd/1f/82/cd1f823254cf35f697da05196448195e.jpg" alt="" />
                </div>

                <div className='socialMedia'>
                    <a id = 'github' href=''>
                        <img src="public/assets/icons/githubwhite.svg" alt="github" />
                    </a>
                    <a id='instagram' href=''>
                        <img src="public/assets/icons/instagram.svg" alt="instagram" />
                    </a>
                    <a id= 'linkedin' href=''>
                        <img src="public/assets/icons/linkedin.svg" alt="linkedin" />
                    </a>
                </div>

                <div className='info'>
                    <span className='name'>
                        NOME&SOBRENOME
                    </span>

                    <span className='function'>
                        FUNÇÃO
                    </span>
                </div>

            </div>

        </div>
        
      </div>
    );
  };