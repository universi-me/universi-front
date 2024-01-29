import UniversimeApi from "@/services/UniversimeApi"
import { competenceListResponse } from "@/services/UniversimeApi/Group"
import { LevelToLabel, Level } from "@/types/Competence"
import { Profile } from "@/types/Profile"
import { useContext, useEffect, useState } from "react"
import { GroupContext } from "../../GroupContext"
import "./GroupCompetence.less"

export function GroupCompetences(){

    const groupContext = useContext(GroupContext)
    console.log(groupContext?.group.id)

    //entendendo como funciona a estrutura da request, apagar depois
    UniversimeApi.Group.listCompetences({groupId: groupContext?.group.id}).then((response)=>{
        console.log(response)
        return response.body;
    }).then((body)=>{
        console.log(body?.competences)
        body?.competences.forEach(competence => {
            console.log("Competencia", competence);
            console.log("Nome da Competencia", competence.competenceName);
            console.log("Id da Competencia", competence.competenceTypeId);
            console.log("Níveis da competência")
            Object.entries(competence.levelInfo).forEach(([level, profile])=> {
                console.log("Perfis: ", profile)
                console.log("Level: ", level)

            });
        });
    })


    const [groupCompetences, setGroupCompetences] = useState<competenceListResponse>();

    useEffect(()=>{
        UniversimeApi.Group.listCompetences({groupId: groupContext?.group.id}).then((response)=>{
            return response.body;
        }).then((body)=>{
            if(body?.competences)
                setGroupCompetences({competences: body.competences});
        })
    }, [])

    function getLevelPercentage(levelInfo: {[key: number] : Profile[]}, level: number){
        let allLevelsSum = 0;
        Object.entries(levelInfo).forEach(([level, profile])=>{
            allLevelsSum+=profile.length
        })
        return levelInfo[level].length/allLevelsSum;
    }

    return (
        <section className="group-tab" id="competence-tab">
            <div className="competence-container">

                {
                    groupCompetences?.competences.map((competence)=>(
                        <div className="competence" id={competence.competenceTypeId}>
                            <div className="competence-name">
                                {competence.competenceName}
                            </div>
                            <div className="competence-level-container">
                                {
                                    Object.entries(competence.levelInfo).map(([level, profiles])=>(
                                     <div className="competence-level">
                                        <div className="level-label">
                                            {
                                                LevelToLabel[parseInt(level) as Level]
                                            }
                                        </div>
                                        <div className="bar-container">
                                            <div className="bar" style={{width: `${getLevelPercentage(competence.levelInfo, parseInt(level))*100}%`}}></div>
                                        </div>
                                     </div>   
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
                {/* Esses vão ser gerados automaticamente, isso é so para teste */}
                {/* <div className="competence">
                    <div className="competence-name">
                        Python
                    </div>
                    <div className="competence-level-container">
                        <div className="competence-level">
                            <div className="level-label">Iniciante</div>
                            <div className="bar-container">
                                <div className="bar"></div>
                            </div>
                        </div>
                        <div className="competence-level">
                            <div className="level-label">Iniciante</div>
                            <div className="bar-container">
                                <div className="bar"></div>
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>
        </section>
    )
}