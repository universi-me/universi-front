import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { EMPTY_LIST_CLASS, GroupContext } from "@/pages/Group";
import { setStateAsValue } from "@/utils/tsxUtils";
import { Profile } from "@/types/Profile";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { getFullName } from "@/utils/profileUtils";

import "./GroupPeople.less";

export function GroupPeople() {
    const groupContext = useContext(GroupContext);
    const [filterPeople, setFilterPeople] = useState<string>("");

    if (!groupContext)
        return null;

    return (
        <section id="people" className="group-tab">
            <div className="heading top-container">
                <div className="title-container">
                    <i className="bi bi-people-fill tab-icon"/>
                    <h2 className="title">Participantes de {groupContext.group.name}</h2>
                </div>
                <div className="go-right">
                    <div id="filter-wrapper">
                        <i className="bi bi-search filter-icon"/>
                        <input type="search" name="filter-people" id="filter-people" className="filter-input"
                            onChange={setStateAsValue(setFilterPeople)} placeholder={`Buscar em participantes de ${groupContext.group.name}`}
                        />
                    </div>
                </div>
            </div>

            <div className="people-list"> { makePeopleList(groupContext.participants, filterPeople) } </div>
        </section>
    );
}

function makePeopleList(people: Profile[], filter: string) {
    if (people.length === 0) {
        return <p className={EMPTY_LIST_CLASS}>Esse grupo não possui participantes.</p>
    }

    const lowercaseFilter = filter.toLowerCase();
    const filteredPeople = filter.length === 0
        ? people
        : people.filter(p => (getFullName(p)).toLowerCase().includes(lowercaseFilter));

    if (filteredPeople.length === 0) {
        return <p className={EMPTY_LIST_CLASS}>Nenhum participante encontrado com a pesquisa.</p>
    }

    return filteredPeople
        .filter(p => !p.user.needProfile)
        .map(renderPerson);
}

function renderPerson(person: Profile) {
    const linkToProfile = `/profile/${person.user.name}`;

    const imageUrl = person.image?.startsWith("/")
        ? `${import.meta.env.VITE_UNIVERSIME_API}${person.image}`
        : person.image;

    return (
        <div className="person-item" key={person.id}>
            <Link to={linkToProfile}>
                <ProfileImage imageUrl={imageUrl} className="person-image" />
            </Link>

            <div className="info">
                <Link to={linkToProfile} className="person-name">{getFullName(person)}</Link>
                <p className="person-bio">{person.bio}</p>
            </div>
        </div>
    );
}
