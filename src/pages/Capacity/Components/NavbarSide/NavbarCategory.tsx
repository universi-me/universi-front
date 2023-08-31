import React, { useState, useEffect, useContext } from 'react';
import UniversimeApi from '@/services/UniversimeApi';
import { Category} from '@/types/Capacity';
import './NavbarCategory.css'

const CategoryNavbar: React.FC = () => {

  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const arr: { value: string; label: string; }[] = [];
      const response = await UniversimeApi.Capacity.categoryList();
      let categoriesArr = response.body.categories;
      setCategories(categoriesArr)
    } catch (error) {
      console.error('Erro ao obter categorias:', error);
    }
  };

  return (
    <nav id="navbar-category">
      <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>CATEGORIAS</h3>
      <ul>
      {categories.map((category : Category) => (
         <li><a href={`/capacitacao/categoria/${category.id}`}>{`- ${category.name}`}</a></li>
      ))}
      </ul>
      <div id="expand-navbar"></div>
    </nav>
  );
};

export default CategoryNavbar;
