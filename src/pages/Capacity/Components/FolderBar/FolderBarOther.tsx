// PlaylistBar.tsx
import React from 'react';
import './FolderBar.css'
import conceitoBancodeDadosImg from '/assets/imgs/Capacity_img/CardPlaylist/banco_de_dados.png';
import habitosProgramadorImg from '/assets/imgs/Capacity_img/CardPlaylist/habitos_programador.png';
import comunicacaoEmpresaImg from '/assets/imgs/Capacity_img/CardPlaylist/comunicacao_empresa.png';
import figmaBasicoImg from '/assets/imgs/Capacity_img/CardPlaylist/figma_basico.png';
import aprendendoPostgresSQLImg from '/assets/imgs/Capacity_img/CardPlaylist/conhecendo_postgresSQL.png';
import melhorarLinkedlnImg from '/assets/imgs/Capacity_img/CardPlaylist/melhorar_linkedln.png';


const PlaylistBar: React.FC = () => {
  return (
    <div className="folder-bar">
      <div className="folder-container">
        <a href="capacitacao/folder/figma-basico" className="folder-card">
          <img src={figmaBasicoImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Figma - Básico</span>
        </a>
        <a href="capacitacao/folder/banco-de-dados" className="folder-card">
          <img src={conceitoBancodeDadosImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Conceitos de Banco de Dados</span>
        </a>
        <a href="capacitacao/folder/habitos-programadores" className="folder-card">
          <img src={habitosProgramadorImg} alt=" Logo da playlist de capacitação" />
          <span className="folder-title">Melhore seus hábitos como programador</span>
        </a>
        <a href="capacitacao/folder/comunicacao-empresa" className="folder-card">
          <img src={comunicacaoEmpresaImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Comunicação:Como melhorar nas empresas?</span>
        </a>
        <a href="capacitacao/folder/aprendendo-postgres" className="folder-card">
          <img src={aprendendoPostgresSQLImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Conhecendo e Aprendendo PostgresSQL</span>
        </a>
        <a href="capacitacao/folder/melhorar-linkendln" className="folder-card">
          <img src={melhorarLinkedlnImg} alt="Logo da playlist de capacitação" />
          <span className="folder-title">Como melhorar seu Linkedln</span>
        </a>
      </div>
    </div>
  );
};

export default PlaylistBar;
