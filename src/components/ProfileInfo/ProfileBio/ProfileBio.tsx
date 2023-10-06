import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ProfileImage } from '@/components/ProfileImage/ProfileImage';
import { getProfileImageUrl } from '@/utils/profileUtils';
import { ICON_EDIT_WHITE } from '@/utils/assets';
import UniversimeApi from '@/services/UniversimeApi';

import type { Profile } from '@/types/Profile';
import './ProfileBio.less';

export type ProfileBioProps = {
    profile: Profile;
};


export function ProfileBio(props: ProfileBioProps) {
    const [contentCounter, setContentCounter] = useState(10)

    useEffect(() =>{
    UniversimeApi.Capacity.contentList()
    .then(res=>setContentCounter(res.body?.contents.length == undefined ? 0 : res.body.contents.length))
    }, [props.profile.user.name])

    return (
        <div className="profile-bio-component card">

            <div className='profile-header'>
                {
                    props.profile.user.ownerOfSession ?
                        <Link className="edit-button" to="/manage-profile">
                            <img src={ICON_EDIT_WHITE} alt="Editar" />
                        </Link>
                    : null
                }
            </div>

            <div className="intro intro-section">
                <ProfileImage className="image" imageUrl={getProfileImageUrl(props.profile)} noImageColor="#505050" />
                <h2 className="card-heading name">{ `${props.profile.firstname} ${props.profile.lastname}` }</h2>
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
