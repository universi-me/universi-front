// CurriculumComponent.tsx
import React from 'react';
import { ComponentProps } from './types';

function CurriculumComponent({ component }: { component: ComponentProps }) {
  return (
    <div>
      <h3>{component.title}</h3>
      <p>{component.description}</p>
      {/* Renderize outros detalhes do componente aqui */}
    </div>
  );
}

export default CurriculumComponent;
