import { FormEvent, ReactNode, useState } from "react";
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Question } from "../../types/question";

import './Quiz.css'
import { Alternative } from "../../types/alternative";
import { useParams } from "react-router-dom";
import { Feedback } from "../../types/feedback";


export function QuizPage() {
    const [responseSent, setResponseSent] = useState<boolean>(false);
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

    // todo: get feedback from database
    const feedback: Feedback = {
        id: 1,
        feedback_text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        link: "https://pt.wikipedia.org/wiki/Lorem_ipsum"
    }

    return (
        <div>
            <div id="question">
                {/* todo: subject comes from API */}
                <div className="subject">
                    <h2>ASSUNTO</h2>
                </div>
                <div className="progress-container">
                    {/* todo: calculate progress */}
                    <div className="progress-current" />
                </div>
                <form className="question-container" onSubmit={sendResponse} >
                    <h2>{question.title}</h2>
                    <RadioGroup.Root name="response" id="radio-group" className={responseSent ? "show-answer" : ""} required={true} disabled={responseSent}>
                    {
                        alternatives.map((alternative, index) => {
                            const alternativeId = `alternative-${index}`;
                            const rightAnswer = responseSent && alternative.correct
                                ? { 'data-right-answer': '' }
                                : {};
                            return (
                                <div className="alternative-container" key={alternative.id} {...rightAnswer}>
                                    <RadioGroup.Item className="alternative" value={`${alternative.id}`} id={alternativeId}>
                                        <RadioGroup.Indicator className="alternative-indicator" />
                                    </RadioGroup.Item>
                                    <label htmlFor={alternativeId}>{alternative.title}</label>
                                </div>
                            );
                        })
                    }
                    </RadioGroup.Root>
                    <button className="submit" type="submit">{responseSent ? "Próxima questão" : "Enviar resposta"}</button>
                </form>
            </div>

            {
                responseSent
                    ? <div id="feedback-container">
                            <div style={{width: 'fit-content'}}>
                                <div className="feedback-bar" />
                                <h3>Segue a dica:</h3>
                            </div>
                            <p className="feedback">{feedback.feedback_text}</p>
                            <a href={feedback.link} className="see-more" target="_blank">Entenda mais</a>
                        </div>

                    : <></>
            }
        </div>
    );

    function sendResponse(event: FormEvent) {
        event.preventDefault();
        setResponseSent(true);
    }
}
