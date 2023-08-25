type TeamMember = {
    name: string;
    socialMedia: {
      github: string;
      instagram: string;
      linkedin: string;
    };
    profilePic: string;
    role: string;
  };
//TODO: pegar as infos da API
  const teamMembers: TeamMember[] = [
    {
      name:'Douglas Sebastian',
      socialMedia: {
        github: 'https://github.com/NiiMiyo/',
        instagram: 'https://www.instagram.com/seu-usuario/',
        linkedin: 'https://www.linkedin.com/in/douglas-sebastian/',
      },
      profilePic: 'https://ayty.org/equipe/img/douglas_Sebastian_Silva_dos_Santos.png',
      role: 'bolsista dev'
    },
    {
        name:'Antonia Cabral',
        socialMedia: {
          github: 'https://github.com/antonia-exe',
          instagram: 'https://www.instagram.com/seu-usuario/',
          linkedin: 'https://www.linkedin.com/in/antonia-vasconcelos-mac/',
        },
        profilePic: 'https://ayty.org/equipe/img/maria_antonia.jpg',
        role: 'bolsista dev / design UI/UX'
      },
      {
        name:'Annehelen Azevêdo',
        socialMedia: {
          github: 'https://github.com/Annehelen-ltda',
          instagram: 'https://www.instagram.com/seu-usuario/',
          linkedin: 'https://www.linkedin.com/in/annehelen-azevedo/',
        },
        profilePic: 'https://ayty.org/equipe/img/annehelen_azevedo.jpg',
        role: 'bolsista dev'
      },
      {
        name:'Clebson Fonseca',
        socialMedia: {
          github: 'https://github.com/whoisclebs',
          instagram: 'https://www.instagram.com/whoisclebs',
          linkedin: 'https://www.linkedin.com/in/whoisclebs',
        },
        profilePic: 'https://ayty.org/equipe/img/clebson.jpg',
        role: 'devOps / software engineer'
      },
      {
        name:'Júlio Verne',
        socialMedia: {
          github: 'https://github.com/julio-ufpb/',
          instagram: 'https://www.instagram.com/jlioverne/',
          linkedin: 'https://www.linkedin.com/in/julioverne/',
        },
        profilePic: 'https://ayty.org/equipe/img/julio_Verne_da_Silva_Rodrigues.jpg',
        role: 'dev back-end'
      },
      {
        name:'Matheus Felipe',
        socialMedia: {
          github: 'https://github.com/matheusfelipe20',
          instagram: 'https://www.instagram.com/felipe_2012matheus/',
          linkedin: 'https://www.linkedin.com/in/matheus-felipe-bandeira-oliveira-30a6b8206/',
        },
        profilePic: 'https://ayty.org/equipe/img/matheus_felipe.jpg',
        role: 'bolsista dev'
      },
      {
        name:'Vinicius Matias',
        socialMedia: {
          github: 'https://github.com/ViniciusMatias',
          instagram: 'https://www.instagram.com/viiniciusmat/',
          linkedin: 'https://www.linkedin.com/in/vinicius-matias-de-lima/',
        },
        profilePic: 'https://ayty.org/equipe/img/vinicius-matias.jpg',
        role: 'bolsista dev'
      },
  ];
  
  export default teamMembers;