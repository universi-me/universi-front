import { MouseEventHandler, useContext } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { getGenderName } from '@/utils/profileUtils';
import { TypeLinkToBootstrapIcon } from '@/types/Link';
import { ProfileImage } from '@/components/ProfileImage/ProfileImage';
import './ProfileBio.css'

export type ProfileBioProps = {
    onClickEdit: MouseEventHandler;
};

export function ProfileBio(props: ProfileBioProps) {
    const profileContext = useContext(ProfileContext)

    return (
        profileContext === null ? null :

        <div className="bio card">
            {
                profileContext.accessingLoggedUser ?
                    <button className="edit-button" onClick={props.onClickEdit}>
                        <img src="/assets/icons/edit-2.svg" alt="Editar" />
                    </button>
                : null
            }

            <div className="intro section">
                <ProfileImage className="image" imageUrl={profileContext.profile.image} noImageColor="#505050" />
                <h2 className="card-heading name">{ `${profileContext.profile.firstname} ${profileContext.profile.lastname}` }</h2>
                <div className="function-pronoun">{ getFunctionGender() }</div>
            </div>

            <div className="about-me section">
                <h3 className="section-heading">Sobre mim</h3>
                {
                    profileContext.profile.bio === null || profileContext.profile.bio.length === 0
                    ? <p style={{fontStyle: 'italic'}}>Nenhuma bio</p>
                    : <p>{ profileContext.profile.bio }</p>
                }
            </div>

            {
                profileContext.profileListData.links.length === 0 ? null :
                <div className="links section">
                    <h3 className="section-heading">Links Importantes</h3>
                    <div className="link-wrapper">
                        {
                            profileContext.profileListData.links.map((link) => {
                                return (<a key={link.id} href={link.url} target='_blank' className="link">
                                    <i className={`icon bi-${TypeLinkToBootstrapIcon[link.typeLink]}`} style={{fontSize: "1.5rem", color: "black"}}></i>
                                    {link.name}
                                </a>);
                            })
                        }
                    </div>
                </div>
            }
            <div className="member-since">{`Membro desde: ${ getMemberSince() }`}</div>
        </div>
    );

    function getMemberSince() {
        const date = new Date(profileContext?.profile.creationDate ?? '')

        const day = date.getDate().toLocaleString('pt-BR', { minimumIntegerDigits: 2, useGrouping: false });
        const month = date.getMonth().toLocaleString('pt-BR', { minimumIntegerDigits: 2, useGrouping: false });
        const year = date.getFullYear().toLocaleString('pt-BR', { minimumIntegerDigits: 2, useGrouping: false });

        return `${day}/${month}/${year}`
    }

    function getFunctionGender() {
        return `Gênero: ${getGenderName(profileContext?.profile.gender)}`
    }
}
