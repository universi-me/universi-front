import { Link } from "react-router";
import ProfileImage from "@/components/ProfileImage";
import { makeClassName } from "@/utils/tsxUtils";
import { ProfileClass } from "@/types/Profile";

import styles from "./ProfileCard.module.less";


export function ProfileCard( props: Readonly<ProfileCardProps> ) {
    const { useLink, renderBio, renderDepartment, inline } = props;
    const profile = new ProfileClass( props.profile );

    const url = `/profile/${profile.user.name}`;
    const imageUrl = profile.image?.startsWith( "/" )
        ? `${import.meta.env.VITE_UNIVERSIME_API}${profile.image}`
        : profile.image;

    const image = <ProfileImage
        imageUrl={imageUrl}
        name={profile.fullname}
        className={ styles.picture }
    />

    const className = makeClassName( styles.card, !inline && styles.bordered, props.className )

    return <div className={ className } key={ profile.id }>
        { useLink
            ? <Link to={ url }>{ image }</Link>
            : image
        }

        <div>
            { useLink
                ? <Link to={ url } className={ styles.name }>{ profile.fullname }</Link>
                : <span className={ styles.name }>{ profile.fullname }</span>
            }

            { renderDepartment && profile.department && <p className={ styles.department }>
                { profile.department.acronym } – { profile.department.name }
            </p> }

            { renderBio && profile.bio && <p className={ styles.bio }>{ profile.bio }</p> }
        </div>
    </div>;
}

export type ProfileCardProps = {
    profile: Profile.DTO;
    useLink?: boolean;
    renderBio?: boolean;
    renderDepartment?: boolean;
    inline?: boolean;
    className?: string;
};
