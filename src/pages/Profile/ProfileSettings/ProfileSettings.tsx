import { ChangeEvent, MouseEvent, useContext, useMemo, useState } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { Link, TypeLinkToBootstrapIcon } from '@/types/Link';
import { getFullName, separateFullName, GENDER_OPTIONS } from '@/utils/profileUtils';
import { UniversimeApi } from '@/hooks/UniversimeApi';
import './ProfileSettings.css'

export type ProfileSettingsProps = {
    cancelChanges: () => any;
    toggleModal:   (show: boolean) => any;
};

const BIO_MAX_LENGTH = 140;
let   NEW_LINK_ID =    -1;

export function ProfileSettings(props: ProfileSettingsProps) {
    const profileContext = useContext(ProfileContext);
    const [profileLinks, setProfileLinks] = useState<Link[]>(profileContext?.profileListData.links ?? []);
    let   competencesToDelete = useMemo<string[]>(() => [], [profileContext?.profileListData.links]);

    return (
        profileContext === null ? null :
        <div id="profile-settings">
            <div className="heading">Editar meu perfil</div>

            <form action="" className="settings-form">
                <div className="section name">
                    <h2>Nome</h2>
                    <input id="name" type="text" placeholder='Insira seu nome e sobrenome' defaultValue={getFullName(profileContext.profile)} />
                </div>

                <div className="section biography">
                    <h2>Biografia</h2>
                    <textarea maxLength={BIO_MAX_LENGTH} name="biography" id="biography" placeholder='Escreva um pouco sobre você' onChange={onChangeBio} defaultValue={profileContext.profile.bio ?? ""}/>
                    <p className="remaining">
                        <p className="number">{BIO_MAX_LENGTH - (profileContext.profile.bio ?? "").length}</p>
                        <p>caracteres</p>
                    </p>
                </div>

                <div className="section gender">
                    <h2>Gênero</h2>
                    <select name="gender" id="gender" className="dropdown-trigger" onChange={onChangeSelect} defaultValue={profileContext.profile.gender ?? ''} style={{color: profileContext.profile.gender ? 'black' : '#6F6F6F'}} >
                        <option disabled value={''}>Selecione o seu gênero</option>
                        {
                            Object.entries(GENDER_OPTIONS).map(([apiValue, name]) => {
                                return (
                                    <option value={apiValue} key={apiValue}>{name}</option>
                                );
                            })
                        }
                    </select>
                </div>

                {/* pronouns were removed because the API doesn't support it yet */}
                {/* <div className="section pronouns">
                    <h2>Pronomes</h2>
                    <select name="pronoun" id="pronoun" className="dropdown-trigger" onChange={onChangeSelect}>
                        <option selected disabled>Selecione os seus pronomes</option>
                        {
                            props.pronounsOptions.map(pronoun => {
                                return (
                                    <option value={pronoun.apiValue} key={pronoun.apiValue}>{pronoun.name}</option>
                                );
                            })
                        }
                    </select>
                </div> */}

                <div className="section social">
                    <div className="heading-wrapper">
                        <h2>Gerenciar Links</h2>
                        <button type="button" title="Adicionar novo link" onClick={addLink} className="add-link">
                            <i className="bi bi-plus-circle-fill" />
                        </button>
                    </div>
                    <div className="box">
                        {
                            profileLinks.map(link => {
                                return (
                                    <div className="item" key={link.id}>
                                        <i className={`icon bi-${TypeLinkToBootstrapIcon[link.typeLink]}`} style={{fontSize: "1.5rem", color: "black"}}></i>
                                        <input type="text" name={link.id.toString()} placeholder='Insira o link' defaultValue={link.url} />
                                        <button className="remove-link" type="button" onClick={removeLink} data-link-name={link.id}>
                                            <i className="bi bi-trash-fill" />
                                        </button>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                <div className="submit">
                    <button type='button' className="cancel-button" onClick={props.cancelChanges}>Cancelar alterações</button>
                    <button type='button' className="submit-button" onClick={saveChanges}>Salvar alterações</button>
                </div>
            </form>
        </div>
    );

    function onChangeBio(e: ChangeEvent<HTMLTextAreaElement>) {
        const remaining = document.querySelector("#profile-settings .section.biography .remaining .number");
        if (remaining)
            remaining.textContent = (e.target.maxLength - e.target.value.length).toString();
    }

    function onChangeSelect(e: ChangeEvent<HTMLSelectElement>) {
        setSelectColor(e.target);
    }
    
    function setSelectColor(sel: HTMLSelectElement) {
        sel.style.color = sel.value ? 'black' : '';
    }

    function addLink() {
        if (profileContext === null)
            return;

        setProfileLinks([...profileLinks, {
            id: NEW_LINK_ID--,
            name: "",
            perfil: profileContext.profile,
            typeLink: "LINK",
            url: "",
        }])
    }

    function removeLink(e: MouseEvent<HTMLButtonElement>) {
        const button = e.currentTarget;
        const linkId = button.getAttribute('data-link-name') ?? "";

        competencesToDelete.push(linkId);
        setProfileLinks(profileLinks.filter(l => l.id.toString() !== linkId));
    }

    function saveChanges() {
        const nameElement = document.getElementById("name");
        const fullname = nameElement !== null
            ? (nameElement as HTMLInputElement).value
            : '';

        const bioElement = document.getElementById("biography");
        const bio = bioElement !== null
            ? (bioElement as HTMLTextAreaElement).value
            : '';

        const genderElement = document.getElementById("gender");
        const gender = genderElement !== null
            ? (genderElement as HTMLSelectElement).value
            : '';

        const [name, lastname] = separateFullName(fullname);

        UniversimeApi.Profile.edit({
            profileId: (profileContext?.profile.id ?? 0).toString(),
            name,
            lastname,
            bio,
            sexo: gender,
        }).then(r => {
            profileContext?.reloadPage();
        });

        const links = classifyLinks();
        links?.toCreate.forEach(link => {
            UniversimeApi.Link.create({
                nome: link.name,
                tipo: link.typeLink,
                url: link.url,
            })
        });

        links?.toDelete.forEach(id => {
            UniversimeApi.Link.remove(id)
        });

        links?.toUpdate.forEach(link => {
            UniversimeApi.Link.update({
                linkId: link.id.toString(),
                nome: link.name,
                tipo: link.typeLink,
                url: link.url,
            })
        })
    }

    function classifyLinks() {
        if (profileContext === null)
            return;

        const toCreate = profileLinks
            .filter(l => l.id < 0)
            .map(l => {
                const urlInputElement = document
                    .querySelector(`#profile-settings .section.social .box .item input[name="${l.id}"]`) as HTMLInputElement | null;

                return {
                    ...l,
                    name: l.name, // todo: get from some input
                    typeLink: l.typeLink, // todo: get from some input
                    url: urlInputElement?.value ?? ""
                } as Link
            });

        const toUpdate = (Array.from(document.querySelectorAll("#profile-settings .section.social .box .item input")) as HTMLInputElement[])
            .map(i => {
                const nameAttr = i.getAttribute("name");
                if (nameAttr === null)
                    return null;

                const linkId = parseInt(nameAttr);
                if (linkId < 0)
                    return null;

                const link = profileLinks.find(l => l.id === linkId) as Link;
                return {
                    id: linkId,
                    name: link.name, // todo: get from some input
                    url: i.value,
                    typeLink: link.typeLink, // todo: get from some input
                    perfil: profileContext.profile
                } as Link
            })
            .filter(l => {
                const link = profileLinks.find(link => l?.id === link.id) as Link;
                return l !== null && (l.name !== link.name || l.typeLink !== link.typeLink || l.url !== link.url);
            }) as Link[]

        return {
            toUpdate,
            toDelete: competencesToDelete,
            toCreate,
        };
    }
}
