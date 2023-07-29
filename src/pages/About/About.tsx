
import './About.css'

export const About = () => {
  
    return (
      <div className='container'>

        <div className='highPart'>

          <div className='text'>
            <h1>UMA EQUIPE DE OUTRO UNIVERSO!</h1>
            <p>
              Lorem ipsum dolor sit amet. Et accusantium quia ut iste quasi et
              galisum voluptas non accusantium dolore sit culpa unde eum.
            </p>
          </div>
  
          <div>
            <img src='public/assets/imgs/New_team_members.svg' alt='equipe' />
          </div>

        </div>

        <div className='carousel'>

            <div className='profile'>

                <div className='header'></div>
                
                <img src="" alt="" />

                <div className='socialmedia'>
                    <a>
                        <img src="public/assets/icons/github.svg" alt="github" />
                    </a>
                    <a>
                        <img src="public/assets/icons/instagram.svg" alt="instagram" />
                    </a>
                    <a>
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