// PlaylistBar.tsx
import React from 'react';
import './FolderBar.css'
import desenvolvimentoWebImg from '/assets/imgs/Capacity_img/CardPlaylist/desenvolvedor_web.png';
import aplicacaoReactImg from '/assets/imgs/Capacity_img/CardPlaylist/aplicacao_react.png';
import aplicacaoVueImg from '/assets/imgs/Capacity_img/CardPlaylist/aplicacao_vue.png';
import golangInicianteImg from '/assets/imgs/Capacity_img/CardPlaylist/golang_iniciante.png';
import golangPraticaImg from '/assets/imgs/Capacity_img/CardPlaylist/golang_pratica.png';
import aprendendoAlgoritmoImg from '/assets/imgs/Capacity_img/CardPlaylist/algoritmo.png';


const PlaylistBar: React.FC = () => {
  return (
    <div className="folder-bar">
      <div className="folder-container">
        <a href="capacitacao/playlist/golang" className="folder-card">
          <img src={golangInicianteImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">O que é Golang ?</span>
        </a>
        <a href="capacitacao/playlist/desenvolvedor-web" className="folder-card">
          <img src={desenvolvimentoWebImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Desenvolvedor WEB</span>
        </a>
        <a href="capacitacao/playlist/react" className="folder-card">
          <img src={aplicacaoReactImg} alt=" Logo da playlist de capacitação" />
          <span className="folder-title">Aplicação em React</span>
        </a>
        <a href="capacitacao/playlist/vue.js" className="folder-card">
          <img src={aplicacaoVueImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Aplicação em Vue.js</span>
        </a>
        <a href="capacitacao/playlist/golang-pratica" className="folder-card">
          <img src={golangPraticaImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Golang na Prática</span>
        </a>
        <a href="capacitacao/playlist/algoritmos" className="folder-card">
          <img src={aprendendoAlgoritmoImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Algoritmos</span>
        </a>
      </div>
    </div>
  );
};

export default PlaylistBar;
