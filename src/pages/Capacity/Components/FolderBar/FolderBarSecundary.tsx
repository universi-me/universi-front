// PlaylistBar.tsx
import React from 'react';
import './FolderBar.css'
import jornadaJavaImg from '/assets/imgs/Capacity_img/CardPlaylist/jornada_java.png';
import javaPraticaImg from '/assets/imgs/Capacity_img/CardPlaylist/java_pratica.png';
import springbootInicianteImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_iniciante.png';
import fullstackSpringImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_fullstack.png';
import springbootApiImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_criandoAPI.png';
import springbootAngularImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_angular.png';


const PlaylistBar: React.FC = () => {
  return (
    <div className="folder-bar">
      <div className="folder-container">
        <a href="capacitacao/folder/java-pratica" className="folder-card">
          <img src={javaPraticaImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Java na prática</span>
        </a>
        <a href="capacitacao/folder/jornada-java" className="folder-card">
          <img src={jornadaJavaImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Jornada Java</span>
        </a>
        <a href="capacitacao/folder/springBoot-iniciante" className="folder-card">
          <img src={springbootInicianteImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Spring Boot - Iniciante</span>
        </a>
        <a href="capacitacao/folder/springBoot-api" className="folder-card">
          <img src={springbootApiImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Spring Boot - Criando API</span>
        </a>
        <a href="capacitacao/folder/springBoot-angular" className="folder-card">
          <img src={springbootAngularImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Spring Boot + Angular</span>
        </a>
        <a href="capacitacao/folder/fullstack-springBoot" className="folder-card">
          <img src={fullstackSpringImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Aplicação Fullstack Spring, React, PostgresSQL</span>
        </a>
      </div>
    </div>
  );
};

export default PlaylistBar;
