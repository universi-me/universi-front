// PlaylistBar.tsx
import React from 'react';
import './PlaylistBar.css'
import desenvolvimentoWebImg from '/assets/imgs/Capacity_img/CardPlaylist/desenvolvedor_web.png';
import aplicacaoReactImg from '/assets/imgs/Capacity_img/CardPlaylist/aplicacao_react.png';
import aplicacaoVueImg from '/assets/imgs/Capacity_img/CardPlaylist/aplicacao_vue.png';
import golangInicianteImg from '/assets/imgs/Capacity_img/CardPlaylist/golang_iniciante.png';
import golangPraticaImg from '/assets/imgs/Capacity_img/CardPlaylist/golang_pratica.png';
import aprendendoAlgoritmoImg from '/assets/imgs/Capacity_img/CardPlaylist/algoritmo.png';


const PlaylistBar: React.FC = () => {
  return (
    <div className="playlist-bar">
      <div className="playlist-container">
        <a href="" className="playlist-card">
          <img src={golangInicianteImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">O que é Golang ?</span>
        </a>
        <a href="" className="playlist-card">
          <img src={desenvolvimentoWebImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Desenvolvedor WEB</span>
        </a>
        <a href="" className="playlist-card">
          <img src={aplicacaoReactImg} alt=" Logo da playlist de capacitação" />
          <span className="playlist-title">Aplicação em React</span>
        </a>
        <a href="" className="playlist-card">
          <img src={aplicacaoVueImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Aplicação em Vue.js</span>
        </a>
        <a href="" className="playlist-card">
          <img src={golangPraticaImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Golang na Prática</span>
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
