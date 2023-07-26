// PlaylistBar.tsx
import React from 'react';
import './PlaylistBar.css'
import jornadaJavaImg from '/assets/imgs/Capacity_img/CardPlaylist/jornada_java.png';
import javaPraticaImg from '/assets/imgs/Capacity_img/CardPlaylist/java_pratica.png';
import springbootInicianteImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_iniciante.png';
import fullstackSpringImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_fullstack.png';
import springbootApiImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_criandoAPI.png';
import springbootAngularImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_angular.png';


const PlaylistBar: React.FC = () => {
  return (
    <div className="playlist-bar">
      <div className="playlist-container">
        <a href="capacitacao/playlist/java-pratica" className="playlist-card">
          <img src={javaPraticaImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Java na prática</span>
        </a>
        <a href="capacitacao/playlist/jornada-java" className="playlist-card">
          <img src={jornadaJavaImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Jornada Java</span>
        </a>
        <a href="capacitacao/playlist/springBoot-iniciante" className="playlist-card">
          <img src={springbootInicianteImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Spring Boot - Iniciante</span>
        </a>
        <a href="capacitacao/playlist/springBoot-api" className="playlist-card">
          <img src={springbootApiImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Spring Boot - Criando API</span>
        </a>
        <a href="capacitacao/playlist/springBoot-angular" className="playlist-card">
          <img src={springbootAngularImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Spring Boot + Angular</span>
        </a>
        <a href="capacitacao/playlist/fullstack-springBoot" className="playlist-card">
          <img src={fullstackSpringImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Aplicação Fullstack Spring, React, PostgresSQL</span>
        </a>
      </div>
    </div>
  );
};

export default PlaylistBar;
