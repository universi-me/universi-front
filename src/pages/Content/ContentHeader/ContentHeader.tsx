import { useContext } from "react";
import { Link } from "react-router-dom";

import { ContentContext } from "@/pages/Content";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { ManageContent } from "@/components/ManageContent";
import { ManageMaterial } from "@/components/ManageMaterial";
import { contentImageUrl } from "@/utils/apiUtils";

import { ProfileClass } from "@/types/Profile";
import "./ContentHeader.less";

export function ContentHeader() {
    const context = useContext(ContentContext);

    if (!context) return null;

    const author = new ProfileClass(context.content.author);
    const assignedBy = context.content.assignedBy && !context.watchingProfile
        ? context.content.assignedBy.map(ProfileClass.new)
        : undefined;

    const materialCount = context.materials.length;
    const materialsDone = context.materials.filter(c => c.status === "DONE").length;
    const materialPercentage = materialsDone / materialCount * 100;
    const shownMaterialPercentage = isNaN(materialPercentage) ? 0 : materialPercentage;

    return <div id="content-header">
        <div id="content-image-name">
            <img id="content-header-image" src={contentImageUrl(context.content)} alt="" />
            <div id="content-main-info">
                <h2 id="content-name">
                    {context.content.name}

                    { context.content.favorite && !context.watchingProfile &&
                        <i id="content-favorite" className="bi bi-star-fill" title={`Você favoritou ${context.content.name}`} />
                    }
                </h2>

                { context.content.categories.length > 1 &&
                    <div id="content-categories">
                    { context.content.categories.map(c =>
                        <div key={c.id} className="content-category-item">
                            { c.name }
                        </div>
                    ) }
                    </div>
                }

                { assignedBy &&
                    <div id="assigned-info">
                        <i id="assigned-by-icon" className="bi bi-pin-angle-fill" />
                        Atribuído a você por
                        {
                            assignedBy.map( ( p, i, arr ) => {
                                return <>
                                    <Link className="assigned-by-link" to={`/profile/${p.user.name}`} key={p.id}>{ p.fullname }</Link>
                                    { arr.length - 1 !== i && ', ' }
                                </>
                            } )
                        }
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

                { context.watchingProfile && 
                    <div id="watch-data">
                        <p id="watching-info">
                            <i className="bi bi-eye" />
                            Você está acompanhando o progresso de <Link to={`/profile/${context.watchingProfile.user.name}`}>{context.watchingProfile.fullname}</Link>
                        </p>
                        <div id="progress-container">
                            <div id="progress-bar-total">
                                <div id="progress-bar-done" style={{width: `${shownMaterialPercentage}%`}} />
                            </div>
                            <p>{context.watchingProfile.firstname} concluiu {materialsDone} de {materialCount} materiais ({
                                shownMaterialPercentage.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            }%) </p>
                        </div>
                    </div>
                }
            </div>
        </div>
        { context.content.canEdit &&
            <div id="content-admin-buttons">
                <ActionButton name="Editar conteúdo" biIcon="bi-pencil-fill" buttonProps={{onClick(){context.setEditingSettings({content: true})}}} />
                <ActionButton name="Adicionar material" biIcon="bi-plus-circle-fill" buttonProps={{onClick(){context.setEditingSettings({material: null})}}} />
            </div>
        }
        { context.editingSettings?.content &&
            <ManageContent content={context.content} afterSave={afterSaveContent} />
        }
        { context.editingSettings?.material !== undefined &&
            <ManageMaterial material={context.editingSettings.material} content={context.content} afterSave={afterSaveMaterials} />
        }
    </div>

    function afterSaveContent() {
        context!.refreshContent().then(context => {
            context.setEditingSettings(undefined);
        });
    }

    function afterSaveMaterials() {
        context!.refreshMaterials().then(context => {
            context.setEditingSettings(undefined);
        });
    }
}
