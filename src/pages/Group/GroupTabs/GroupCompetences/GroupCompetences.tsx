import { UniversimeApi } from "@/services"
import { CompetenceLevelObjectsArray, strToLevel } from "@/types/Competence"
import { useContext, useEffect, useState } from "react"
import { GroupContext } from "../../GroupContext"
import "./GroupCompetence.less"

export function GroupCompetences(){

    const groupContext = useContext(GroupContext)
    const [groupCompetences, setGroupCompetences] = useState<Group.CompetenceInfo[]>();
    const [competencesInfo, setCompetencesInfo] = useState<CompetenceInfo[]>();

    const [orderedByName, setOrderedByName] = useState<boolean | undefined>(undefined);
    const [orderedByPeople, setOrderedByPeople] = useState<boolean | undefined>(undefined);
    const [orderedByLevel, setOrderedByLevel] = useState<{inOrder : boolean, level : number} | undefined>(undefined);

    type CompetenceInfo = {
        competenceName: string,
        competencePeople: Profile.DTO[],
        competenceTypeId: string,
        competenceLevelInfo: {
            level: Competence.Level,
            people: Profile.DTO[]
        }[]
    }


    useEffect(()=>{
        UniversimeApi.GroupParticipant.competences( groupContext?.group.id! ).then( response => {
            if ( response.data ) {
                setGroupCompetences( response.data );
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
        groupCompetences.forEach((competence)=>{

            let people : Profile.DTO[] = [];
            let levelInfo = CompetenceLevelObjectsArray.map( lv => ({
                level: lv.level,
                people: [] as Profile.DTO[],
            }) );

            Object.entries(competence.levelInfo).forEach(([lv, profiles])=>{
                const level = strToLevel( lv );
                people.push( ...profiles );
                levelInfo.forEach((infoLevel)=>{
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

    function getLevelPercentage(competencePeople : Profile.DTO[], levelInfo: Profile.DTO[]) : number{

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

        if(!orderedByLevel)
            setOrderedByLevel({inOrder: false, level: level})

        console.log(level)
        console.log(competencesInfo[0].competenceLevelInfo[level])

        let sortedCompetences = [...competencesInfo].sort((a,b)=>{return getLevelPercentage(a.competencePeople, a.competenceLevelInfo[level].people) - getLevelPercentage(b.competencePeople, b.competenceLevelInfo[level].people)})

        if(orderedByLevel?.inOrder == true)
            sortedCompetences.reverse();

        setCompetencesInfo(sortedCompetences);

        setOrderedByLevel((prevState) =>({...prevState, inOrder: !prevState?.inOrder, level: level}));
        console.log(orderedByLevel)

        setOrderedByPeople(undefined)
        setOrderedByName(undefined)

    }



    return (
        <section className="group-tab" id="competence-tab">
            <div className="competence-tab">
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
                        CompetenceLevelObjectsArray.map(({level, label})=>(
                            <div className="label" onClick={() => {orderByLevel(level)}} key={level}>
                                {label}
                                {
                                    orderedByLevel?.level == level && orderedByLevel.inOrder?
                                    <i className="bi bi-caret-up-fill"></i>
                                    : orderedByLevel?.level == level && !orderedByLevel.inOrder?
                                    <i className="bi bi-caret-down-fill"></i>
                                    :
                                    <></>
                                }
                            </div>
                        ))
                    }
                </div>
                <div className="competence-container">
                {
                    !competencesInfo ? <></> :
                    competencesInfo.map((competence)=>(
                        <div className="competence" key={ competence.competenceTypeId }>
                            <div className="competence-name">{competence.competenceName}</div>
                            <div className="amount-people">{competence.competencePeople.length}</div>
                                {
                                    competence.competenceLevelInfo.map((level)=>(
                                    <div className="competence-level-container" key={ level.level }>
                                        <div className="competence-level">
                                            <div className="bar-container">
                                                <div className="bar" style={
                                                    {width: `${getLevelPercentage(competence.competencePeople, level.people)}%`}
                                                }></div>
                                                <div className="bar-label">
                                                    {Math.trunc(getLevelPercentage(competence.competencePeople, level.people))}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))
                                }
                        </div>
                    ))
                }
                </div>

            </div>
        </section>
    )
}