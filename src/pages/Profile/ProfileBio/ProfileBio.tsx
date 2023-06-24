import './ProfileBio.css'

export type ProfileBioProps = {
    name: string;
    image: string;
    memberSince: string;
    functionPronouns: string;
    aboutMe: string;
    links: string[];
};

export function ProfileBio(props: ProfileBioProps) {
    return (
        <div className="bio card">
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
        </div>
    );
}
