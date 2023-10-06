import { MouseEventHandler, useContext, useEffect, useState } from 'react';
import { ProfileContext } from '@/pages/Profile';
import { getGenderName, getProfileImageUrl } from '@/utils/profileUtils';
import { TypeLinkToBootstrapIcon } from '@/types/Link';
import { ProfileImage } from '@/components/ProfileImage/ProfileImage';
import { Link } from 'react-router-dom';
import { ICON_EDIT_BLACK } from '@/utils/assets';
import './ProfileBio.css'
import UniversimeApi from '@/services/UniversimeApi';

export type ProfileBioProps = {
    onClickEdit: MouseEventHandler;
};




export function ProfileBio(props: ProfileBioProps) {
    const profileContext = useContext(ProfileContext)
    const [contentCounter, setContentCounter] = useState(10)

    useEffect(() =>{
    UniversimeApi.Capacity.contentList()
    .then(res=>setContentCounter(res.body?.contents.length == undefined ? 0 : res.body.contents.length))
    }, [profileContext?.profile.user.name])

    return (
        profileContext === null ? null :

        <div className="bio card">

            <div className='profile-header'>
                {
                    profileContext.accessingLoggedUser ?
                        <Link className="edit-button" to="/manage-profile">
                            <img src={ICON_EDIT_BLACK} alt="Editar" />
                        </Link>
                    : null
                }
            </div>

            <div className="intro intro-section">
                <ProfileImage className="image" imageUrl={getProfileImageUrl(profileContext.profile)} noImageColor="#505050" />
                <h2 className="card-heading name">{ `${profileContext.profile.firstname} ${profileContext.profile.lastname}` }</h2>
                {
                    profileContext.profile.bio === null || profileContext.profile.bio.length === 0
                    ? <p style={{fontStyle: 'italic', textAlign: 'center'}}>Nenhuma bio</p>
                    : <p style={{whiteSpace: 'break-spaces', textAlign: 'center'}}>{ profileContext.profile.bio }</p>
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
            <div className="content-count">Meus conteúdos: {contentCounter}</div>
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
