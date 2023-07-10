import "./GroupIntro.css"

export type GroupIntroProps = {
    /**
     * Group image on CSS. Can be a color (e.g. "#4E4E4E") or image (e.g. "url(/api/group_image.png)")
     */
    imageUrl: string;

    /**
     * Group name
     */
    name: string;

    /**
     * Group type
     */
    type: string;

    /**
     * If true will render a verified icon
     */
    verified: boolean;
}

export function GroupIntro(props: GroupIntroProps) {
    return (
        <div id="group-intro">
            <div className="image" style={{backgroundImage: props.imageUrl, backgroundColor: props.imageUrl}} />
            <div className="name">
                <h2 >{props.name}</h2>
                {
                    props.verified ?
                        <img src="/assets/icons/icon-verificated.svg" className="verified-icon" />
                    : null
                }
            </div>
            <div className="type">{props.type}</div>
        </div>
    );
}