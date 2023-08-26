import { useContext } from "react";
import { GroupContext } from "@/pages/Group";
import { Link } from "react-router-dom";
import "./GroupAbout.css"

export function GroupAbout() {
    const groupContext = useContext(GroupContext);

    return (
        groupContext === null ? null :

        <div id="about" className="card">
            <div className="section">
                <h2 className="card-heading">Sobre</h2>
                <p className="description">{groupContext.group.description}</p>
                <Link to={`/profile/${groupContext.group.admin.user.name}`} className="admin-button">Administrador</Link>
            </div>
            <div className="created-at">Criado em: { getCreationDate() }</div>
        </div>
    );

    function getCreationDate(): string {
        const date = new Date(groupContext?.group.createdAt ?? '');

        const day = date.getDate().toLocaleString('pt-BR', { minimumIntegerDigits: 2, useGrouping: false });
        const month = date.getMonth().toLocaleString('pt-BR', { minimumIntegerDigits: 2, useGrouping: false });
        const year = date.getFullYear().toLocaleString('pt-BR', { minimumIntegerDigits: 2, useGrouping: false });

        return `${day}/${month}/${year}`
    }
}
