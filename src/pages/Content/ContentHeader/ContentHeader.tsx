import { useContext } from "react";
import { Link } from "react-router-dom";

import { ContentContext } from "@/pages/Content";
import { ProfileClass } from "@/types/Profile";
import { contentImageUrl } from "@/utils/apiUtils";

import "./ContentHeader.less";

export function ContentHeader() {
    const context = useContext(ContentContext);

    if (!context) return null;

    const author = new ProfileClass(context.content.author);
    const assignedBy = context.content.assignedBy
        ? new ProfileClass(context.content.assignedBy)
        : undefined;

    return <div id="content-header">
        <img id="content-header-image" src={contentImageUrl(context.content)} alt="" />
        <div id="content-main-info">
            <h2 id="content-name">
                {context.content.name}

                { context.content.favorite &&
                    <i id="content-favorite" className="bi bi-star-fill" title={`Você favoritou ${context.content.name}`} />
                }
            </h2>

            { assignedBy &&
                <div id="assigned-info">
                    <i id="assigned-by-icon" className="bi bi-pin-angle-fill" />
                    Atribuído a você por
                    <Link id="assigned-by-link" to={`/profile/${assignedBy.user.name}`}>{ assignedBy.fullname }</Link>
                </div>
            }

            <div id="created-info">
                Criado
                {/* {" "} em { new Date(context.content.createdAt).toLocaleDateString() } */}
                {" "} por <Link to={`/profile/${author.user.name}`}> { author.fullname } </Link>
            </div>

            {
                context.content.description &&
                <p id="content-description">{context.content.description}</p>
            }
        </div>
    </div>
}