// PlaylistBar.tsx
import React from 'react';
import './PlaylistBar.css'
import conceitoBancodeDadosImg from '/assets/imgs/Capacity_img/CardPlaylist/banco_de_dados.png';
import habitosProgramadorImg from '/assets/imgs/Capacity_img/CardPlaylist/habitos_programador.png';
import comunicacaoEmpresaImg from '/assets/imgs/Capacity_img/CardPlaylist/comunicacao_empresa.png';
import figmaBasicoImg from '/assets/imgs/Capacity_img/CardPlaylist/figma_basico.png';
import aprendendoPostgresSQLImg from '/assets/imgs/Capacity_img/CardPlaylist/conhecendo_postgresSQL.png';
import melhorarLinkedlnImg from '/assets/imgs/Capacity_img/CardPlaylist/melhorar_linkedln.png';


const PlaylistBar: React.FC = () => {
  return (
    <div className="playlist-bar">
      <div className="playlist-container">
        <a href="" className="playlist-card">
          <img src={figmaBasicoImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Figma - Básico</span>
        </a>
        <a href="" className="playlist-card">
          <img src={conceitoBancodeDadosImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Conceitos de Banco de Dados</span>
        </a>
        <a href="" className="playlist-card">
          <img src={habitosProgramadorImg} alt=" Logo da playlist de capacitação" />
          <span className="playlist-title">Melhore seus hábitos como programador</span>
        </a>
        <a href="" className="playlist-card">
          <img src={comunicacaoEmpresaImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Comunicação:Como melhorar nas empresas?</span>
        </a>
        <a href="" className="playlist-card">
          <img src={aprendendoPostgresSQLImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Conhecendo e Aprendendo PostgresSQL</span>
        </a>
        <a href="" className="playlist-card">
          <img src={melhorarLinkedlnImg} alt="Logo da playlist de capacitação" />
          <span className="playlist-title">Como melhorar seu Linkedln</span>
        </a>
      </div>
    </div>
  );
};

export default PlaylistBar;
