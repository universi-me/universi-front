import { ChangeEvent, useContext, useState } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { getFullName, separateFullName } from '@/utils/profileUtils';
import { UniversimeApi } from '@/hooks/UniversimeApi';
import './ProfileSettings.css'

export type ProfileSettingsProps = {
    cancelChanges: () => any;
    toggleModal:   (show: boolean) => any;
};

const BIO_MAX_LENGTH = 140;
const GENDER_OPTIONS = [
    { apiValue: 'M', name: 'Masculino' },
    { apiValue: 'F', name: 'Feminino' },
    { apiValue: 'O', name: 'Outro' },
];

export function ProfileSettings(props: ProfileSettingsProps) {
    const profileContext = useContext(ProfileContext);
    if (profileContext === null)
        return null;

    const [profileLinks, setProfileLinks] = useState<any[]>(profileContext.profile.links);

    return (
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
                            GENDER_OPTIONS.map(gender => {
                                return (
                                    <option value={gender.apiValue} key={gender.apiValue}>{gender.name}</option>
                                );
                            })
                        }
                    </select>
                </div>

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
                    <h2>Gerenciar Links</h2>
                    <div className="box">
                        {
                            profileLinks.map(link => {
                                return (
                                    <div className="item" key={link.apiValue}>
                                        <img src={`/assets/icons/${link.apiValue}.svg`} alt={link.name} />
                                        <input type="text" name={link.apiValue} placeholder='Insira seu usuário' />
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

        UniversimeApi.ProfileApi.edit({
            profileId: (profileContext?.profile.id ?? 0).toString(),
            name,
            lastname,
            bio,
            sexo: gender,
        }).then(r => {
            profileContext?.reloadPage();
        })
    }
}
