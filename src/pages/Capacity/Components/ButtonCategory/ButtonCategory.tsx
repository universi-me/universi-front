import React from 'react';
import './ButtonCategory.css'

const RecommendedCategories: React.FC = () => {
  return (
    <div>
      <h1 id="title" style={{ marginBottom: '20px', marginTop: '35px' }}>Categorias recomendadas para você</h1>
      <div className="button-container">
        <a href="/capacitacao/categoria/java" className="theme-button">Java</a>
        <a href="/capacitacao/categoria/html-css" className="theme-button">HTML/CSS</a>
        <a href="/capacitacao/categoria/python" className="theme-button">Python</a>
        <a href="/capacitacao/categoria/golang" className="theme-button">Golang</a>
        <a href="/capacitacao/categoria/javascript" className="theme-button">Java Script</a>
        <a href="/capacitacao/categoria/react" className="theme-button">React</a>
        <a href="/capacitacao/categoria/angular" className="theme-button">Angular</a>
        <a href="/capacitacao/categoria/soft-Skills" className="theme-button">Soft Skills</a>
        <a href="/capacitacao/categoria/banco-de-Dados" className="theme-button">Banco de Dados</a>
        <a href="/capacitacao/categoria/git" className="theme-button">Git</a>
      </div>
    </div>
  );
};

export default RecommendedCategories;
