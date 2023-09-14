// CurriculumType.tsx
import React from 'react';
import { ComponentProps } from './types';
import CurriculumComponent from './CurriculumComponent';

interface CurriculumTypeProps {
  componentType: { id: string; name: string }; // Substitua pela estrutura real do tipo de componente
  components: ComponentProps[];
}

function CurriculumType({ componentType, components }: CurriculumTypeProps) {
  return (
    <div>
      <h2>{componentType.name}</h2>
      {components.map((component) => (
        <CurriculumComponent key={component.id} component={component} />
      ))}
    </div>
  );
}

export default CurriculumType;
