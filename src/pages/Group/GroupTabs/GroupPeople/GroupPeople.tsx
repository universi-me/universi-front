import { useContext, useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

import { EMPTY_LIST_CLASS, GroupContext } from "@/pages/Group";
import { ProfileClass } from "@/types/Profile";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";

import "./GroupPeople.less";
import { Filter } from "@/components/Filter/Filter";
import Select from 'react-select'
import { CompetenceLevelObjects, CompetenceLevelObjectsArray, intToLevel } from "@/types/Competence";
import { UniversimeApi } from "@/services"
import ActionButton from "@/components/ActionButton";
import useCanI from "@/hooks/useCanI";
import { Permission } from "@/utils/roles/rolesUtils";
import UniversiForm from "@/components/UniversiForm";
import { AuthContext } from "@/contexts/Auth";
import ProfileCard from "@/components/ProfileCard";

type competenceSearch = {
    typeId?: string,
    level?: Competence.Level,
    label?: string
}

export function GroupPeople() {
    const groupContext = useContext(GroupContext);
    const authContext = useContext(AuthContext);
    const [filterPeople, setFilterPeople] = useState<string>("");
    const [allTypeCompetence, setAllTypeCompetence] = useState<Competence.Type[] | undefined>()
    const [currentCompetence, setCurrentCompetence] = useState<competenceSearch>()
    const [addedCompetences, setAddedCompetences] = useState<competenceSearch[]>([])
    const [matchEveryCompetence, setMatchEveryCompetence] = useState<boolean>(false)
    const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false)
    const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);

    const canI = useCanI();

    useEffect(()=>{
        UniversimeApi.CompetenceType.list().then((response)=>{
            if(response.isSuccess())
                return response.data
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

    }, [ addedCompetences, matchEveryCompetence ])


    const competenceTypeOptions = useMemo(() => {
        return orderByName(allTypeCompetence ?? [])
    }, [allTypeCompetence]);

    function orderByName(competences : Competence.Type[]){
        return competences
            .slice()
            .sort((c1,c2) => c1.name.localeCompare(c2.name))
            .map((t)=> ({value: t.id, label: t.name})) ?? [];
    }

    function removeAddedCompetence(typeId: string, level: Competence.Level){
        setAddedCompetences((addedCompetences) => addedCompetences.filter((element) => !(element.typeId === typeId && element.level === level)))
    }

    function searchUsers(){
        clearFilteredPeople();
        showOnlyFilteredPeople(addedCompetences, matchEveryCompetence)
        let searchCriteria = document.getElementById("search-criteria");
        if(searchCriteria)
            searchCriteria?.classList.remove("hidden")
        setShowAdvancedSearch(false);
    }

    if (!groupContext)
        return null;

    const [participantsOrganization, setParticipantsOrganization] = useState<ProfileClass[]>();
    const loadingParticipantsOrganization = participantsOrganization === undefined;

    function handleShowAddPeople(){
        return () => {
            setShowAddPeopleModal(true);
        }
    }

    useEffect(() => {
        const fetchParticipants = () => {
            setParticipantsOrganization( undefined );
            UniversimeApi.GroupParticipant.get(authContext.organization.id as string).then((response) => {
                if (response.isSuccess() && Array.isArray(response.data)) {
                    setParticipantsOrganization(
                        response.data
                        .filter( p => undefined === groupContext.participants.find( gp => gp.id === p.id ) )
                        .map( ProfileClass.new )
                    );
                }
            });
        }
        if (showAddPeopleModal) {
            fetchParticipants();
        }
    }, [showAddPeopleModal, authContext.organization.id]);

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

                    {
                        canI("PEOPLE", Permission.READ_WRITE, groupContext.group) &&
                            <ActionButton name="Adicionar" buttonProps={{ onClick: handleShowAddPeople() }} />
                    }

                    {
                        showAddPeopleModal && !loadingParticipantsOrganization &&
                            <UniversiForm.Root title="Adicionar participante" callback={ handleForm } confirmButton={ { text: "Adicionar" } }>
                                <UniversiForm.Input.Select
                                    param="participant"
                                    label="Usuário"
                                    required
                                    options={ participantsOrganization }
                                    getOptionUniqueValue={ p => p.id }
                                    getOptionLabel={ p => p.fullname! }
                                />
                            </UniversiForm.Root>
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

                <div className="levels-div checkbox">
                    <label htmlFor="matchEveryCompetence">Exigir todas as competências</label>
                    <input
                        type="checkbox"
                        name="matchEveryCompetence"
                        checked={matchEveryCompetence}
                        onChange={()=>{setMatchEveryCompetence(!matchEveryCompetence)}}
                    />
                </div>

                <ActionButton name="Limpar busca" biIcon="x-lg" buttonProps={{
                    className: "clear-search",
                    onClick( ) {
                        const searchCriteriaText = document.getElementById("search-criteria")
                        if(searchCriteriaText) searchCriteriaText.classList.add("hidden")
                        clearFilteredPeople();
                        setAddedCompetences([]);
                    }
                }} />
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
                    onChange={(option:any)=>{
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


                <ActionButton name="Adicionar competência à busca" biIcon="search" buttonProps={{
                    onClick( ) {
                        if(currentCompetence?.level == undefined || !currentCompetence.label || !currentCompetence.typeId)
                            return;

                        currentCompetence.label += ": " + CompetenceLevelObjects[currentCompetence.level].label
                        setAddedCompetences([...addedCompetences, currentCompetence]);

                        let radio = document.getElementById(`radio${currentCompetence.level}`) as HTMLInputElement

                        radio.checked = false
                        setCurrentCompetence(undefined)
                    }
                }} />

                <ActionButton name="Fechar" biIcon="x-lg" buttonProps={{
                    onClick() { setShowAdvancedSearch(false) },
                    className: 'search-button'
                }} />

            </div>
        )
    }

    function showOnlyFilteredPeople(searchCompetence : competenceSearch[], matchEveryCompetence : boolean){
            UniversimeApi.GroupParticipant.filter({
                competences: searchCompetence.map((c) => ({ id: c.typeId ?? "", level: c.level ?? 0 })),
                matchEveryCompetence: matchEveryCompetence,
                groupId: groupContext?.group.id,
                groupPath: groupContext?.group.path
            }).then((response) => {
                if (response.isSuccess()) {
                    return response.data;
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
        return (
            <div className="levels-div">
            {
                CompetenceLevelObjectsArray.map(({ level, label })=>(
                    <label key={ level }>
                        <input
                            type="radio"
                            name="level"
                            value={level}
                            id={`radio${level}`}
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
                                event.target.checked=currentCompetence?.level != undefined && currentCompetence?.level == level
                            }}
                        />
                        {label}
                    </label>
                ))
            }
            </div>
        )
    }

    async function handleForm( form: GroupPeopleForm ) {
        if ( !form.confirmed ) {
            setShowAddPeopleModal( false );
            return;
        }

        await UniversimeApi.GroupParticipant.add({
            groupId: groupContext!.group.id!,
            participant: form.body.participant.id,
        });

        await groupContext!.refreshData();
        setShowAddPeopleModal( false );
    }
}

type GroupPeopleForm = UniversiForm.Data<{
    participant: ProfileClass;
}>;


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
        .map( p => <ProfileCard
            profile={ p }
            key={ p.id }
            useLink
            renderBio
            renderDepartment
            className="person-item"
        /> );
}
