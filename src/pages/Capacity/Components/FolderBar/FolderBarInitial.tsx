// PlaylistBar.tsx
import React from 'react';
import './FolderBar.css'
import jornadaJavaImg from '/assets/imgs/Capacity_img/CardPlaylist/jornada_java.png';
import golangInicianteImg from '/assets/imgs/Capacity_img/CardPlaylist/golang_iniciante.png';
import comunicacaoEmpresaImg from '/assets/imgs/Capacity_img/CardPlaylist/comunicacao_empresa.png';
import habitosProgramadorImg from '/assets/imgs/Capacity_img/CardPlaylist/habitos_programador.png';
import springbootApiImg from '/assets/imgs/Capacity_img/CardPlaylist/springBoot_criandoAPI.png';
import aprendendoAlgoritmoImg from '/assets/imgs/Capacity_img/CardPlaylist/algoritmo.png';


const PlaylistBar: React.FC = () => {
  return (
    <div className="folder-bar">
      <div className="folder-container">
        <a href="capacitacao/folder/jornada-java" className="folder-card">
          <img src={jornadaJavaImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Jornada Java</span>
        </a>
        <a href="capacitacao/folder/golang-iniciante" className="folder-card">
          <img src={golangInicianteImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Golang Iniciante</span>
        </a>
        <a href="capacitacao/folder/comunicacao-empresa" className="folder-card">
          <img src={comunicacaoEmpresaImg} alt=" Logo da playlist de capacitação" />
          <span className="folder-title">Comunicação: Como melhorar nas empresas?</span>
        </a>
        <a href="capacitacao/folder/habitos-programadores" className="folder-card">
          <img src={habitosProgramadorImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Melhore seus hábitos como programador</span>
        </a>
        <a href="capacitacao/folder/springBoot-api" className="folder-card">
          <img src={springbootApiImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Spring Boot - Criando API</span>
        </a>
        <a href="capacitacao/folder/algoritmos" className="folder-card">
          <img src={aprendendoAlgoritmoImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Algoritmos</span>
        </a>
      </div>
    </div>
  );
};

export default PlaylistBar;
