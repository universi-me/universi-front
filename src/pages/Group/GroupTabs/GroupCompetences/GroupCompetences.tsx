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
        if(!levelInfo || !levelInfo[level])
            return 0;
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
                            <div className="amount-people">
                                Pessoas:{" "+Object.entries(competence.levelInfo).length}
                            </div>
                            <div className="competence-level-container">
                                {
                                    Object.entries(LevelToLabel).map((level)=>(
                                        <div className="competence-level">
                                            <div className="level-label">
                                                {
                                                    LevelToLabel[parseInt(level[0]) as Level]
                                                }
                                            </div>
                                            <div className="bar-container">
                                                <div className="bar" style={{width: `${getLevelPercentage(competence.levelInfo, parseInt(level[0]))*100}%`}}>
                                                </div>
                                            </div>
                                            <div className="bar-label">
                                            {
                                                getLevelPercentage(competence.levelInfo, parseInt(level[0]))*100
                                            }
                                            %
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}