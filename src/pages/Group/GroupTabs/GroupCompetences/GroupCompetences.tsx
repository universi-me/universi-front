import UniversimeApi from "@/services/UniversimeApi"
import { competenceListResponse } from "@/services/UniversimeApi/Group"
import { LevelToLabel, Level } from "@/types/Competence"
import { Profile } from "@/types/Profile"
import { useContext, useEffect, useState } from "react"
import { GroupContext } from "../../GroupContext"
import "./GroupCompetence.less"

export function GroupCompetences(){

    const groupContext = useContext(GroupContext)
    const [groupCompetences, setGroupCompetences] = useState<competenceListResponse>();
    const [competencesInfo, setCompetencesInfo] = useState<CompetenceInfo[]>();

    const [orderedByName, setOrderedByName] = useState<boolean | undefined>(undefined);
    const [orderedByPeople, setOrderedByPeople] = useState<boolean | undefined>(undefined);
    const [orderedByLevel, setOrderedByLevel] = useState<boolean | undefined>(undefined);

    type CompetenceInfo = {
        competenceName: string,
        competencePeople: Profile[],
        competenceTypeId: string,
        competenceLevelInfo: {
            level: string,
            people: Profile[]
        }[]
    }


    useEffect(()=>{
        UniversimeApi.Group.listCompetences({groupId: groupContext?.group.id}).then((response)=>{
            return response.body;
        }).then((body)=>{
            if(body?.competences){
                setGroupCompetences({competences: body.competences});
            }
        })
    }, [])

    useEffect(()=>{
        generateCompetenceInfo();
    }, [groupCompetences])

    function generateCompetenceInfo(){
        if(!groupCompetences)
            return;

        let createCompetenceInfo : CompetenceInfo[] = []
        groupCompetences.competences.map((competence)=>{

            let people : Profile[] = [];
            let levelInfo : {
                level: string,
                people: Profile[]
            }[] = [];

            Object.entries(LevelToLabel).map((level)=>{
                levelInfo.push({level: level[0], people: []})
            })

            Object.entries(competence.levelInfo).map(([level, profiles])=>{
                profiles.map((profile)=>{
                    people.push(profile)
                })
                levelInfo.map((infoLevel)=>{
                    infoLevel.level == level ? infoLevel.people = profiles : null;
                })
            })


            let competenceInfo : CompetenceInfo = {
                competenceName: competence.competenceName,
                competenceTypeId: competence.competenceTypeId,
                competencePeople: people,
                competenceLevelInfo: levelInfo
            }

            createCompetenceInfo.push(competenceInfo);
        })


        setCompetencesInfo(createCompetenceInfo);

    }

    function getLevelPercentage(competencePeople : Profile[], levelInfo: Profile[]) : number{

        if(!competencePeople || !levelInfo)
            return 0;

        return (levelInfo.length/competencePeople.length)*100

    }

    function orderByName(){

        if(!competencesInfo)
            return

        let sortedCompetences = [...competencesInfo].sort((a, b)=>{return a.competenceName.localeCompare(b.competenceName)})

        if(orderedByName == true){
            sortedCompetences.reverse();
        }

        setCompetencesInfo(sortedCompetences);
        setOrderedByName(!orderedByName)
        
        setOrderedByLevel(undefined)
        setOrderedByPeople(undefined)
    }

    function orderByPeople(){

        if(!competencesInfo)
            return

        let sortedCompetences = [...competencesInfo].sort((a,b)=>{return a.competencePeople.length - b.competencePeople.length})

        if(orderedByPeople == true)
            sortedCompetences.reverse();

        setCompetencesInfo(sortedCompetences);
        setOrderedByPeople(!orderedByPeople)

        setOrderedByLevel(undefined)
        setOrderedByName(undefined)
    }

    function orderByLevel(level : number){

        if(!competencesInfo)
            return

        console.log(level)
        console.log(competencesInfo[0].competenceLevelInfo[level])

        let sortedCompetences = [...competencesInfo].sort((a,b)=>{return getLevelPercentage(a.competencePeople, a.competenceLevelInfo[level].people) - getLevelPercentage(b.competencePeople, b.competenceLevelInfo[level].people)})

        if(orderedByLevel == true)
            sortedCompetences.reverse();

        setCompetencesInfo(sortedCompetences);
        setOrderedByLevel(!orderedByLevel);

        setOrderedByPeople(undefined)
        setOrderedByName(undefined)

    }



    return (
        <section className="group-tab" id="competence-tab">
            <div className="competence-container">
                <div className="labels">
                    <div className="label" onClick={orderByName}>
                        Competência
                        {
                            orderedByName ?
                            <i className="bi bi-caret-down-fill"></i>
                            : orderedByName == false ?
                            <i className="bi bi-caret-up-fill"></i>
                            :
                            <></>
                        }
                    </div>
                    <div className="label" onClick={orderByPeople}>
                        Pessoas
                        {
                            orderedByPeople ?
                            <i className="bi bi-caret-down-fill"></i>
                            : orderedByPeople == false ?
                            <i className="bi bi-caret-up-fill"></i>
                            :
                            <></>
                        }
                    </div>
                    {
                        Object.entries(LevelToLabel).map((level)=>(
                            <div className="label" onClick={() => orderByLevel(parseInt(level[0]))}>
                                {level[1]}
                                {
                                    orderedByLevel ?
                                    <i className="bi bi-caret-down-fill"></i>
                                    : orderedByLevel == false ?
                                    <i className="bi bi-caret-up-fill"></i>
                                    :
                                    <></>
                                }
                            </div>
                        ))
                    }
                </div>

                {
                    !competencesInfo ? <></> :
                    competencesInfo.map((competence)=>(
                        <div className="competence">
                            <div className="competence-name">{competence.competenceName}</div>
                            <div className="amount-people">{competence.competencePeople.length}</div>
                                {
                                    competence.competenceLevelInfo.map((level)=>(
                                    <div className="competence-level-container">
                                        <div className="competence-level">
                                            <div className="bar-container">
                                                <div className="bar" style={
                                                    {width: `${getLevelPercentage(competence.competencePeople, level.people)}%`}
                                                }></div>
                                                <div className="bar-label">
                                                    {getLevelPercentage(competence.competencePeople, level.people)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))
                                }
                        </div>
                    ))
                }

{/* 
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
                } */}
            </div>
        </section>
    )
}