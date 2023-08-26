import React from 'react';
import './NavbarCategory.css'

const CategoryNavbar: React.FC = () => {
  return (
    <nav id="navbar-category">
      <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>CATEGORIAS</h3>
      <ul>
        <li><a href="/capacitacao/categoria/java"> - Java</a></li>
        <li><a href="/capacitacao/categoria/html-css"> - HTML/CSS</a></li>
        <li><a href="/capacitacao/categoria/python"> - Python</a></li>
        <li><a href="/capacitacao/categoria/golang"> - Golang</a></li>
        <li><a href="/capacitacao/categoria/javascript"> - Java Script</a></li>
        <li><a href="/capacitacao/categoria/react"> - React</a></li>
        <li><a href="/capacitacao/categoria/vue"> - Vue.js</a></li>
        <li><a href="/capacitacao/categoria/node"> - Node</a></li>
        <li><a href="/capacitacao/categoria/angular"> - Angular</a></li>
        <li><a href="/capacitacao/categoria/git"> - Git</a></li>
        <li><a href="/capacitacao/categoria/soft-Skills"> - Soft Skills</a></li>
        <li><a href="/capacitacao/categoria/banco-de-Dados"> - Banco de Dados</a></li>
        <li><a href="/capacitacao/categoria/figma"> - Figma</a></li>
        <li><a href="/capacitacao/categoria/linkedln"> - Linkedln</a></li>
      </ul>
      <div id="expand-navbar"></div>
    </nav>
  );
};

export default CategoryNavbar;
