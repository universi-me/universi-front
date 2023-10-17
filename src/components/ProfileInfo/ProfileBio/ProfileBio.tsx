import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ProfileImage } from '@/components/ProfileImage/ProfileImage';
import { getFullName, getProfileImageUrl } from '@/utils/profileUtils';
import { ICON_EDIT_WHITE } from '@/utils/assets';
import UniversimeApi from '@/services/UniversimeApi';

import type { Profile } from '@/types/Profile';
import './ProfileBio.less';

export type ProfileBioProps = {
    profile: Profile;
};


export function ProfileBio(props: ProfileBioProps) {
    const [contentCounter, setContentCounter] = useState(10)
    const linkToOwnProfile = `/profile/${props.profile.user.name}`;
    const isOnOwnProfile = location.pathname.replace(/\/+$/, "") == linkToOwnProfile;
    const renderEditButton = props.profile.user.ownerOfSession && isOnOwnProfile;

    useEffect(() =>{
    UniversimeApi.Profile.folders({assignedOnly: true, profileId: props.profile.id})
    .then(res=>setContentCounter(res.body?.folders.length ?? 0))
    }, [props.profile.user.name])

    return (
        <div className="profile-bio-component card">

            <div className='profile-header'>
                {
                    renderEditButton ?
                        <Link className="edit-button" to="/manage-profile" title="Editar seu perfil">
                            <img src={ICON_EDIT_WHITE} alt="Editar" />
                        </Link>
                    : null
                }
            </div>

            <div className="intro intro-section">
                <ProfileImage className="image" imageUrl={getProfileImageUrl(props.profile)} noImageColor="#505050" />
                {
                    isOnOwnProfile
                        ? <h2 className="card-heading name">{ getFullName(props.profile) }</h2>
                        : <Link className="card-heading name" to={linkToOwnProfile}>{ getFullName(props.profile) }</Link>
                }
                {
                    props.profile.bio === null || props.profile.bio.length === 0
                    ? <p style={{fontStyle: 'italic', textAlign: 'center'}}>Nenhuma bio</p>
                    : <p style={{whiteSpace: 'break-spaces', textAlign: 'center'}}>{ props.profile.bio }</p>
                }
            </div>
            <div className="content-count">Meus conteúdos: {contentCounter}</div>
        </div>
    );
}
