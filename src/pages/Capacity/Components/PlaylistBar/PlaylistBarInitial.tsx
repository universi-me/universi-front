// PlaylistBar.tsx
import React from 'react';
import './PlaylistBar.css'
import jornadaJavaImg from '/assets/imgs/Capacity_img/CardPlaylist/jornada_java.png';
import golangInicianteImg from '/assets/imgs/Capacity_img/CardPlaylist/golang_iniciante.png';
import comunicacaoEmpresaImg from '/assets/imgs/Capacity_img/CardPlaylist/comunicacao_empresa.png';
import habitosProgramadorImg from '/assets/imgs/Capacity_img/CardPlaylist/habitos_programador.png';
import springbootApiImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_criandoAPI.png';
import aprendendoAlgoritmoImg from '/assets/imgs/Capacity_img/CardPlaylist/algoritmo.png';


const PlaylistBar: React.FC = () => {
  return (
    <div className="playlist-bar">
      <div className="playlist-container">
        <a href="" className="playlist-card">
          <img src={jornadaJavaImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Jornada Java</span>
        </a>
        <a href="" className="playlist-card">
          <img src={golangInicianteImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">O que é Golang ?</span>
        </a>
        <a href="" className="playlist-card">
          <img src={comunicacaoEmpresaImg} alt=" Logo da playlist de capacitação" />
          <span className="playlist-title">Comunicação: Como melhorar nas empresas?</span>
        </a>
        <a href="" className="playlist-card">
          <img src={habitosProgramadorImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Melhore seus hábitos como programador</span>
        </a>
        <a href="" className="playlist-card">
          <img src={springbootApiImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Spring Boot - Criando API</span>
        </a>
        <a href="" className="playlist-card">
          <img src={aprendendoAlgoritmoImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Algoritmos</span>
        </a>
      </div>
    </div>
  );
};

export default PlaylistBar;
