import "./GroupAbout.css"

export type GroupAboutProps = {
    /**
     * Group description
     */
    description: string;

    // Group creation date
    creationDate: string;
};

export function GroupAbout(props: GroupAboutProps) {
    return (
        // todo: card component
        <div id="about" className="card">
            <div className="section">
                <h2 className="card-heading">Sobre</h2>
                <p className="description">{props.description}</p>
                <button className="admin-button">Administrador</button>
            </div>
            <div className="created-at">Criado em: {props.creationDate}</div>
        </div>
    );
}
