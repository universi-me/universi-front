import { useContext, useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

import { EMPTY_LIST_CLASS, GroupContext, GroupContextType } from "@/pages/Group";
import { ProfileClass } from "@/types/Profile";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";

import "./GroupPeople.less";
import { Filter } from "@/components/Filter/Filter";
import Select from 'react-select'
import { CompetenceType, LevelToLabel, Level, intToLevel } from "@/types/Competence";
import UniversimeApi from "@/services/UniversimeApi";

type competenceSearch = {
    typeId?: string,
    level?: Level,
    label?: string
}

export function GroupPeople() {
    const groupContext = useContext(GroupContext);
    const [filterPeople, setFilterPeople] = useState<string>("");
    const [allTypeCompetence, setAllTypeCompetence] = useState<CompetenceType[] | undefined>()
    const [currentCompetence, setCurrentCompetence] = useState<competenceSearch>()
    const [addedCompetences, setAddedCompetences] = useState<competenceSearch[]>([])
    const [matchEveryCompetence, setMatchEveryCompetence] = useState<boolean>(false)
    const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false)

    useEffect(()=>{
        UniversimeApi.CompetenceType.list().then((response)=>{
            if(response.success)
                return response.body.list
        })
        .then((list)=>{
            setAllTypeCompetence(list)
        })
    }, [])

    useEffect(()=>{

        if(addedCompetences.length == 0){
            document.getElementById("search-criteria")?.classList.add("hidden")
            clearFilteredPeople();
        }
        else
            searchUsers();

    }, [addedCompetences])


    const competenceTypeOptions = useMemo(() => {
        return orderByName(allTypeCompetence ?? [])
    }, [allTypeCompetence]);

    function orderByName(competences : CompetenceType[]){
        return competences
            .slice()
            .sort((c1,c2) => c1.name.localeCompare(c2.name))
            .map((t)=> ({value: t.id, label: t.name})) ?? [];
    }

    function removeAddedCompetence(typeId: string, level: Level){
        setAddedCompetences((addedCompetences) => addedCompetences.filter((element) => !(element.typeId === typeId && element.level === level)))
    }

    function searchUsers(){
        clearFilteredPeople();
        showOnlyFilteredPeople(addedCompetences, matchEveryCompetence)
        let searchCriteria = document.getElementById("search-criteria");
        if(searchCriteria)
            searchCriteria?.classList.remove("hidden")
    }

    if (!groupContext)
        return null;

    return (
        <section id="people" className="group-tab">
            <div className="heading top-container">
                <div className="go-right go-right-people">
                    <Filter setter={setFilterPeople} placeholderMessage={`Buscar em participantes de ${groupContext.group.name}`}/>
                    <div className="advanced-button-container" onClick={()=>{setShowAdvancedSearch(!showAdvancedSearch)}}>
                        <i className="bi bi-sliders2"></i>
                    </div>

                    {
                        showAdvancedSearch 
                        ? renderAdvancedSearch()
                        : <></>
                    }

                </div>
            </div>
            
            <div className="search-criteria hidden" id="search-criteria">
                <div className="all-competences-container">
                {
                    matchEveryCompetence?
                    "Filtro(todos): "
                    :
                    "Filtro: "
                }
                {
                    addedCompetences.map((c)=>(
                        <div className="added-competence-container">
                            <i className="bi bi-funnel-fill"></i>
                            <div className="added-competence">{c.label}</div>
                            <i className="bi bi-x-lg" onClick={()=>{
                                if(c.typeId == undefined || c.level == undefined)
                                    return

                                removeAddedCompetence(c.typeId, c.level)
                            }}></i>
                        </div>
                    ))
                }

                </div>
                <p className="clear-search" onClick={()=>{
                    let searchCriteriaText = document.getElementById("search-criteria")
                    if(searchCriteriaText) searchCriteriaText.classList.add("hidden")
                    clearFilteredPeople();
                }}>Limpar busca</p>
            </div>

            <div className="people-list tab-list"> { 
                makePeopleList(groupContext.participants, filterPeople)
            } 
                <div id="people-not-found-message" className="people-not-found hidden">Não foi encontrada nenhuma pessoa que corresponde à pesquisa.</div>
            </div>
        </section>
    );

    function renderAdvancedSearch(){
        return(
            <div id="advanced-search" className="advanced-search">
                <Select
                    options={competenceTypeOptions}
                    value={{value: currentCompetence?.typeId?.toString(), label : currentCompetence?.label}}
                    onChange={(option)=>{
                        if(!option || !option.value) return
                        let newCompetence : competenceSearch;
                        newCompetence = {
                            typeId: option.value,
                            label: option.label
                        }

                        if(currentCompetence)
                            newCompetence.level = currentCompetence.level

                        setCurrentCompetence(newCompetence)
                    }}
                    placeholder={"nome da competência"}
                />
                {
                    makeRadioSelectLevel()
                }


                <div className="add-competence-button" onClick={()=>{
                    if(!currentCompetence || currentCompetence.level == undefined || !currentCompetence.label || !currentCompetence.typeId) return

                    currentCompetence.label += ": " + LevelToLabel[currentCompetence.level]
                    setAddedCompetences([...addedCompetences, currentCompetence]);

                    let radio = document.getElementById(`radio${currentCompetence.level}`) as HTMLInputElement

                    radio.checked = false
                    setCurrentCompetence(undefined)
                }
                }>
                    Adicionar competência à busca
                </div>

                <div className="levels-div checkbox">
                    <label htmlFor="matchEveryCompetence">Exigir todas as competências</label>
                    <input
                        type="checkbox"
                        name="matchEveryCompetence"
                        checked={matchEveryCompetence}
                        onChange={()=>{setMatchEveryCompetence(!matchEveryCompetence)}}
                    />
                </div>

                <div className="added-competences-container">
                    { addedCompetences.length != 0? 
                        addedCompetences.map((competence)=>(
                            <div className="added-competence" key={competence.typeId??"" + competence.level}>
                                {competence.label}
                                <i className="bi bi-x" onClick={()=>{
                                    if(competence.typeId == undefined || competence.level == undefined)
                                        return
                                    removeAddedCompetence(competence.typeId, competence.level);
                                }}></i>
                            </div>
                        ))
                        : <></>
                    }
                </div>

                <div className="search-button" onClick={searchUsers}>
                    Pesquisar
                </div>

            </div>
    
        )
    }

    function showOnlyFilteredPeople(searchCompetence : competenceSearch[], matchEveryCompetence : boolean){
            UniversimeApi.Group.filterParticipants({
                competences: searchCompetence.map((c) => ({ id: c.typeId ?? "", level: c.level ?? 0 })),
                matchEveryCompetence: matchEveryCompetence,
                groupId: groupContext?.group.id,
                groupPath: groupContext?.group.path
            }).then((response) => {
                if (response.data.success) {
                    return response.data.body?.filteredParticipants;
                } 
            }).then((participants) => {
                if (participants) {
                    let participantsIds = participants.map((p) => p.id);
                    let allParticipants = document.getElementsByClassName("person-item");
                    Array.from(allParticipants).forEach((element) => {
                        if (element.id && !participantsIds.includes(element.id)) {
                            element.classList.add("hidden")
                        }
                    });
                    if(participants.length == 0){
                        document.getElementById("people-not-found-message")?.classList.remove("hidden")
                    }
                }
            }).catch((error) => {
                console.error(error);
        });
    }

    function clearFilteredPeople(){
        let participantsCards = document.getElementsByClassName("person-item")
        Array.from(participantsCards).forEach(participantCard =>{
            participantCard.classList.remove("hidden")
        })
        document.getElementById("people-not-found-message")?.classList.add("hidden")
    }

    function makeRadioSelectLevel(){
        const levels = Object.entries(LevelToLabel)
        return (
            <div className="levels-div">
            {
                levels.map((level)=>(
                    <label>
                        <input
                            type="radio"
                            name="level"
                            value={level[0]}
                            id={`radio${level[0]}`}
                            onChange={(event)=>{
                                let currentCompetence_old : competenceSearch;
                                if(currentCompetence){
                                    currentCompetence_old = currentCompetence
                                    currentCompetence.level = intToLevel(parseInt(event.target.value))
                                }
                                else
                                    currentCompetence_old = {
                                        level: intToLevel(parseInt(event.target.value))
                                    }
                                setCurrentCompetence(currentCompetence_old)
                                event.target.checked=currentCompetence?.level != undefined && currentCompetence?.level == parseInt(level[0])
                            }}
                        />
                        {level[1]}
                    </label>
                ))
            }
            </div>
        )
    }
}


// function toggleAdvancedSearch(){
//     let searchDiv = document.getElementById("advanced-search");
//     if(searchDiv?.style.display != "none")
//         searchDiv?.style.setProperty("display", "none")
//     else
//         searchDiv?.style.setProperty("display", "")
// }

function makePeopleList(people: ProfileClass[], filter: string) {
    if (people.length === 0) {
        return <p className={EMPTY_LIST_CLASS}>Esse grupo não possui participantes.</p>
    }

    const lowercaseFilter = filter.toLowerCase();
    const filteredPeople = filter.length === 0
        ? people
        : people.filter(p => (p.fullname ?? "").toLowerCase().includes(lowercaseFilter));

    if (filteredPeople.length === 0) {
        return <p className={EMPTY_LIST_CLASS}>Nenhum participante encontrado com a pesquisa.</p>
    }

    return filteredPeople
        .filter(p => !p.user.needProfile)
        .map(renderPerson);
    
}

function renderPerson(person: ProfileClass) {
    const linkToProfile = `/profile/${person.user.name}`;

    const imageUrl = person.image?.startsWith("/")
        ? `${import.meta.env.VITE_UNIVERSIME_API}${person.image}`
        : person.image;

    return (
        <div className="person-item tab-item" key={person.id} id={person.id}>
            <Link to={linkToProfile}>
                <ProfileImage imageUrl={imageUrl} name={person.fullname} className="person-image" />
            </Link>

            <div className="info">
                <Link to={linkToProfile} className="person-name">{person.fullname}</Link>
                <p className="person-bio">{person.bio}</p>
            </div>
        </div>
    );
}
