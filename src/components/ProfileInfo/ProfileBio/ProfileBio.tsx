import { Link } from 'react-router-dom';

import { ProfileImage } from '@/components/ProfileImage/ProfileImage';
import { getFullName, getProfileImageUrl } from '@/utils/profileUtils';
import { ICON_EDIT_WHITE } from '@/utils/assets';

import type { Profile } from '@/types/Profile';
import { TypeLinkToBootstrapIcon, type Link as Link_API } from '@/types/Link';
import './ProfileBio.less';

export type ProfileBioProps = {
    profile: Profile;
    links: Link_API[];
};


export function ProfileBio(props: ProfileBioProps) {
    const linkToOwnProfile = `/profile/${props.profile.user.name}`;
    const isOnOwnProfile = location.pathname.replace(/\/+$/, "") == linkToOwnProfile;
    const renderEditButton = props.profile.user.ownerOfSession && isOnOwnProfile;

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

            { props.links.length === 0 ? null :
                <div className="content-count">
                    <div className="links-wrapper">
                        {
                            props.links.map((link) => {
                                return <a href={link.url} className="profile-bio-link" target='_blank' key={link.id}>
                                    <i className={`link-type-icon bi bi-${TypeLinkToBootstrapIcon[link.typeLink]}`}/>
                                    { link.name }
                                </a>
                            })
                        }
                    </div>
                </div>
            }

        </div>
    );
}
