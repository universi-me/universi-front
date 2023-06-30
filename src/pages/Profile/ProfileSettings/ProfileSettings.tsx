import { ChangeEvent, MouseEventHandler } from 'react';
import './ProfileSettings.css'

type OptionProps = {
    name: string;
    apiValue: string;
};

export type ProfileSettingsProps = {
    genderOptions: OptionProps[];
    pronounsOptions: OptionProps[];
    socialOptions: OptionProps[];

    cancelChanges: MouseEventHandler;
    saveChanges: MouseEventHandler;
};

const BIO_MAX_LENGTH = 140;

export function ProfileSettings(props: ProfileSettingsProps) {
    return (
        <div id="profile-settings">
            <div className="heading">Editar meu perfil</div>

            <form action="" className="settings-form">
                <div className="section name">
                    <h2>Nome</h2>
                    <input id="name" type="text" placeholder='Insira seu nome e sobrenome' />
                </div>

                <div className="section biography">
                    <h2>Biografia</h2>
                    <textarea maxLength={BIO_MAX_LENGTH} name="biography" id="biography" placeholder='Escreva um pouco sobre você' onChange={onChangeBio} />
                    <p className="remaining">
                        <p className="number">{BIO_MAX_LENGTH}</p>
                        <p>caracteres</p>
                    </p>
                </div>

                <div className="section gender">
                    <h2>Gênero</h2>
                    <select name="gender" id="gender" className="dropdown-trigger" onChange={onChangeSelect} >
                        {/* todo: change selected to user choice */}
                        <option selected disabled>Selecione o seu gênero</option>
                        {
                            props.genderOptions.map(gender => {
                                return (
                                    <option value={gender.apiValue} key={gender.apiValue}>{gender.name}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className="section pronouns">
                    <h2>Pronomes</h2>
                    <select name="pronoun" id="pronoun" className="dropdown-trigger" onChange={onChangeSelect}>
                        {/* todo: change selected to user choice */}
                        <option selected disabled>Selecione os seus pronomes</option>
                        {
                            props.pronounsOptions.map(pronoun => {
                                return (
                                    <option value={pronoun.apiValue} key={pronoun.apiValue}>{pronoun.name}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className="section social">
                    <h2>Redes Sociais</h2>
                    <div className="box">
                        {
                            props.socialOptions.map(social => {
                                return (
                                    <div className="item" key={social.apiValue}>
                                        <img src={`/assets/icons/${social.apiValue}.svg`} alt={social.name} />
                                        <input type="text" name={social.apiValue} placeholder='Insira seu usuário' />
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                <div className="submit">
                    <button type='button' className="cancel-button" onClick={props.cancelChanges}>Cancelar alterações</button>
                    <button type='button' className="submit-button" onClick={props.saveChanges}>Salvar alterações</button>
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
}
