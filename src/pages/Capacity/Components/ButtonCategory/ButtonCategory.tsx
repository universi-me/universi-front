import React, { useEffect, useState } from 'react';
import './ButtonCategory.css'
import { Category } from '@/types/Capacity';
import { Link } from 'react-router-dom';
import UniversimeApi from '@/services/UniversimeApi';

const RecommendedCategories: React.FC = () => {
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  useEffect(() => {
    UniversimeApi.Capacity.categoryList()
        .then(res => setAvailableCategories(res.body.categories));
  }, [])

  return (
    <div>
      <h1 id="title" style={{ marginBottom: '20px', marginTop: '35px' }}>Categorias recomendadas para você</h1>
      <div className="button-container">
        {
          availableCategories.length === 0
            ? <div className="empty-list">Nenhuma categoria cadastrada.</div>
            : availableCategories.map(c =>
            <Link to={`/capacitacao/categoria/${c.id}`} key={c.id} className="theme-button">{c.name}</Link>
          )
        }
      </div>
    </div>
  );
};

export default RecommendedCategories;
