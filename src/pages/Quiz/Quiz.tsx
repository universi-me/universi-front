import { ReactNode } from "react";
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Question } from "../../types/question";

import './Quiz.css'
import { Alternative } from "../../types/alternative";
import { useParams } from "react-router-dom";


export function QuizPage() {
    const { id } = useParams();
    // todo: check if id is undefined

    // todo: get question data from database
    const question: Question = {
        id: 1,
        title: "São softwares livres:",
        feedback_id: 1,
        user_create_id: 1
    }

    // todo: get alternatives from database
    const alternatives: Alternative[] = [
        { correct: true, id: 1, question_id: 1, title: "Gnome-desktop, Clementine e Openssh" },
        { correct: false, id: 2, question_id: 1, title: "Avast, Google Chrome e Openssh" },
        { correct: false, id: 3, question_id: 1, title: "MS Office, Mozila Firefox e Ubuntu" },
        { correct: false, id: 4, question_id: 1, title: "Openvpn, Virtualbox e Photoshop" },
        { correct: false, id: 5, question_id: 1, title: "LibreOffice, Virtualbox e Eclipse" }
    ]

    return (
        <div id="question">
            {/* todo: subject comes from API */}
            <div className="subject">
                <h2>ASSUNTO</h2>
            </div>
            <div className="progress-container">
                {/* todo: calculate progress */}
                <div className="progress-current" />
            </div>
            <form className="question-container">
                <h2>{question.title}</h2>
                <RadioGroup.Root name="response">
                 {
                    alternatives.map((alternative, index) => {
                        const alternativeId = `alternative-${index}`;
                        return (
                            <div className="alternative-container" key={alternative.id}>
                                <RadioGroup.Item className="alternative" value={`${alternative.id}`} id={alternativeId}>
                                    <RadioGroup.Indicator className="alternative-indicator" />
                                </RadioGroup.Item>
                                <label htmlFor={alternativeId}>{alternative.title}</label>
                            </div>
                        );
                    })
                 }
                </RadioGroup.Root>
                 <button className="submit" type="submit">Enviar Resposta</button>
            </form>
        </div>
    );
}
