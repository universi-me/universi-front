// CurriculumPage.tsx
import React, { useEffect, useState } from 'react';
import CurriculumType from '../components/CurriculumType';
import { getProfileComponents, getComponentTypes } from '../services/curriculumService'; // Implemente esses serviços

function CurriculumPage() {
  const [profileComponents, setProfileComponents] = useState<ProfileComponent[]>([]); // Defina o tipo ProfileComponent
  const [componentTypes, setComponentTypes] = useState<ComponentType[]>([]); // Defina o tipo ComponentType

  useEffect(() => {
    // Buscar dados do perfil do usuário
    getProfileComponents()
      .then((data: ProfileComponent[]) => setProfileComponents(data))
      .catch((error) => console.error(error));

    // Buscar tipos de componentes
    getComponentTypes()
      .then((data: ComponentType[]) => setComponentTypes(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      {componentTypes.map((type) => (
        <CurriculumType
          key={type.id}
          type={type}
          components={profileComponents.filter((component) => component.componentType.id === type.id)}
        />
      ))}
    </div>
  );
}

export default CurriculumPage;
