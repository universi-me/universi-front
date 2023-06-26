import { useState } from 'react';
import { Modal } from '@/components/Modal/Modal';
import { ProfileSettings } from '../ProfileSettings/ProfileSettings';
import './ProfileBio.css'

export type ProfileBioProps = {
    name: string;
    image: string;
    memberSince: string;
    functionPronouns: string;
    aboutMe: string;
    links: string[];
    loggedUserProfile: boolean;
};

export function ProfileBio(props: ProfileBioProps) {
    const [ showSettings, setShowSettings ] = useState<boolean>(false);

    return (
        <div className="bio card">
            {
                props.loggedUserProfile ?
                    <button className="edit-button" onClick={toggleEditButton}>
                        <img src="/assets/icons/edit-2.svg" alt="Editar" />
                    </button>
                : null
            }

            <div className="intro section">
                <div className="image" style={{backgroundColor: props.image}} />
                <h2 className="card-heading name">{ props.name }</h2>
                <div className="function-pronoun">{ props.functionPronouns }</div>
            </div>

            <div className="about-me section">
                <h3 className="section-heading">Sobre mim</h3>
                <p>{ props.aboutMe }</p>
            </div>

            <div className="links section">
                <h3 className="section-heading">Links Importantes</h3>
                <div className="link-wrapper">
                    {
                        props.links.map((link) => {
                            return (<a key={""} href="" className="link"></a>);
                        })
                    }
                </div>
            </div>
            <div className="member-since">{`Membro desde: ${props.memberSince}`}</div>

            {
                showSettings &&
                <Modal onClickOutside={toggleEditButton} >
                    <ProfileSettings />
                </Modal>
            }
        </div>
    );

    function toggleEditButton() {
        setShowSettings(!showSettings);
    }
}
