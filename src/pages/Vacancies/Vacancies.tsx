import React, { useContext, MouseEvent, useEffect, useState } from 'react';
import { list, VacancyList_ResponseDTO } from '@/services/UniversimeApi/Vacancy';
import { Vacancy } from '@/types/Vacancy';
import './Vacancies.css'
import { ProfileContext } from '../Profile';

export type VacancyProps = {
    openVacancySettings: (e: MouseEvent) => void;
}

export function Vacancies(props: VacancyProps) {
    const [vacancies, setVacancies] = useState<Vacancy[]>();
    const profileContext = useContext(ProfileContext);

    if (profileContext === null) {
        return null;
    }

    const addVacancy = (e: MouseEvent<HTMLButtonElement>) => {
        profileContext.setEditVacancy(null);
        props.openVacancySettings(e);
    }
  
    useEffect(() => {
      async function fetchVacancies() {
        try {
          const response: VacancyList_ResponseDTO = await list();
          if (response.success) {
            setVacancies(response.body?.lista);
          } else {
            console.error('Erro ao buscar vagas:', response.message);
          }
        } catch (error) {
          console.error('Erro ao buscar vagas:', error);
        }
      }
  
      fetchVacancies();
    }, []);
  
    return (
      <div>
        <div className="header-vacancy">
            <h2 className="title-header">Vagas Disponíveis</h2>
            {  profileContext.profile.firstname === 'Admin' && (
                <button className="button-addVacancy" onClick={addVacancy}>Adicionar Vaga</button>
            )}
        </div>
        <div className="vacancy">
            <div className="list-vacancy">
                <div className="panel-vacancy">
                    <img className="image-vacancy" src='/assets/icons/work-black.svg'/>
                    <h3 className="title-vacancy">Projeto AYTY Phoebus - UFPB</h3>
                    <h3 className="type-vacancy">Projeto de Extensão</h3>
                </div>
                <div className="date-vacancy">
                    <h3 className="textDate-vacancy">( de</h3>
                    <h3 className="date-format">23-10-2023</h3>
                    <h3 className="textDate-vacancy">até</h3>
                    <h3 className="date-format">30-10-2023</h3>
                    <h3 className="textDate-vacancy">)</h3>
                </div>
                <div className="prequisites-vacancy">
                    <h3 className="prequisites-title">Pré-requisito: </h3>
                    <h3 className="prequisites-format">Java ◦ Vue.js ◦ JavaScript</h3>
                </div>
                <div className="description">
                    <h3 className="description-title">Descrição</h3>
                    <h3 className="description-vacancy">Projeto AYTY Phoebus - UFPB <br/> bla bla <br/> bla</h3>
                </div>
            </div>
        </div>


        {/* {vacancies ? (
          <ul>
            {vacancies.map((vacancy) => (
              <li key={vacancy.id}>
                <h3>{vacancy.title}</h3>
                <p>{vacancy.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-vacancy">Nenhuma vaga disponível</p>
        )} */}
      </div>
    );
  }