import React, { useEffect, useState } from 'react';
import { list, VacancyList_ResponseDTO } from '@/services/UniversimeApi/Vacancy';
import { Vacancy } from '@/types/Vacancy';
import './Vacancies.css'

export function Vacancies() {
    const [vacancies, setVacancies] = useState<Vacancy[]>();
  
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
        <h2>Vagas Disponíveis</h2>
        <div className="vacancy">
            <div className="list-vacancy">
                <div className="panel-vacancy">
                    <h3 className="title-vacancy">Projeto AYTY Phoebus - UFPB</h3>
                    <h3 className="type-vacancy">Projeto de Extensão</h3>
                </div>
                <div className="date-vacancy">
                    <h3 className="textDate-vacancy">aberto desde</h3>
                    <h3 className="date-format">23-10-2023</h3>
                    <h3 className="textDate-vacancy">até</h3>
                    <h3 className="date-format">30-10-2023</h3>
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