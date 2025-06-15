import { Link } from 'react-router-dom';

import { ProfileImage } from '@/components/ProfileImage/ProfileImage';
import { ICON_EDIT_WHITE } from '@/utils/assets';
import { groupBannerUrl } from '@/utils/apiUtils';

import { ProfileClass } from '@/types/Profile';
import { TypeLinkToBootstrapIcon } from '@/types/Link';
import './ProfileBio.less';

export type ProfileBioProps = {
    profile: Profile;
    organization?: Group | null;
    links: Link[];
};


export function ProfileBio(props: ProfileBioProps) {
    const linkToOwnProfile = `/profile/${props.profile.user.name}`;
    const isOnOwnProfile = location.pathname.replace(/\/+$/, "") == linkToOwnProfile;
    const renderEditButton = props.profile.user.ownerOfSession && isOnOwnProfile;

    const headerBackground = props.organization
        ? { backgroundImage: `url(${groupBannerUrl(props.organization)})` }
        : { backgroundColor: "@primary-color" }

    const profile = new ProfileClass(props.profile);

    return (
        <div className="profile-bio-component card">

            <div className='profile-header' style={headerBackground}>
                {
                    renderEditButton ?
                        <div className="edit-button">
                            <Link to="/manage-profile" title="Editar seu perfil">
                                <img src={ICON_EDIT_WHITE} alt="Editar" className="edit-icon" />
                            </Link>
                        </div>
                    : null
                }
            </div>

            <div className="intro intro-section">
                <ProfileImage className="image" imageUrl={profile.imageUrl} name={profile.fullname} noImageColor="#505050" />
                {
                    isOnOwnProfile
                        ? <h2 className="card-heading name">{ profile.fullname }</h2>
                        : <Link className="card-heading name" to={linkToOwnProfile}>{ profile.fullname }</Link>
                }
                {
                    props.profile.department && <p className="profile-department">
                        {props.profile.department.acronym} – {props.profile.department.name}
                    </p>
                }
                {
                    props.profile.bio?.length &&
                    <p className='profile-bio'>{ props.profile.bio }</p>
                }
            </div>

            { props.links.length === 0 ? null :
                <div className="content-count">
                    <div className="links-wrapper">
                        {
                            props.links.map((link) => {
                                return <a href={link.url} className="profile-bio-link" target='_blank' key={link.id}>
                                    <i className={`link-type-icon bi bi-${TypeLinkToBootstrapIcon[link.typeLink]}`} title={`${link.name}`}/>
                                </a>
                            })
                        }
                    </div>
                </div>
            }

        </div>
    );
}
