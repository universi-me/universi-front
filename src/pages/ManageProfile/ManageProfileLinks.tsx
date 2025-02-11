import { useState, MouseEvent, ChangeEvent, EventHandler } from "react";
import { TypeLinkToBootstrapIcon } from "@/types/Link";

export type ManageProfileLinksProps = {
    profileLinks: Link[];
    typeLinks: {
        value: TypeLink;
        label: string;
    }[];

    submitLinks: EventHandler<MouseEvent>;
};

// Decreases by 1 each time a link is added
let NEW_LINK_ID = -1;

export function ManageProfileLinks(props: ManageProfileLinksProps) {
    const [profileLinks, setProfileLinks] = useState(props.profileLinks);

    return (
        <fieldset id="fieldset-links" className="card">
            <div className="heading">
                <h2 className="legend">Gerenciar meus links</h2>
                <button id="new-link" type="button" title="Adicionar novo link" onClick={newLink}>
                    <i className="bi bi-plus-circle-fill" />
                </button>
            </div>

            <div className="links-container">
                {profileLinks.map(link => 
                    <div className="link-item" key={link.id} data-link-id={link.id}>
                        <section className="name-type-container">
                            <select defaultValue={link.typeLink} onChange={changeLinkType} data-link-field="type" data-link-id={link.id}>
                                <option disabled>Tipo do link</option>
                                {
                                    props.typeLinks
                                        .map(typeLink => {
                                            return (
                                                <option value={typeLink.value} key={typeLink.value}>
                                                    { typeLink.label }
                                                </option>
                                            );
                                        })
                                }
                            </select>
                            <input type="text" placeholder="Insira o nome desse link" defaultValue={link.name} data-link-field="name" />
                        </section>
                        <section className="url-remove-container">
                            <span className={`type-icon bi bi-${TypeLinkToBootstrapIcon[link.typeLink]}`} />
                            <input type="url" placeholder="Insira o link" defaultValue={link.url} data-link-field="url" />
                            <button type="button" className="remove-link" onClick={removeLink} data-link-id={link.id}>
                                <span className="bi bi-trash-fill" />
                            </button>
                        </section>
                    </div>
                )}
            </div>

            <section id="submit-links" className="submit">
                <button type="button" onClick={props.submitLinks}>
                    Salvar alterações de links
                </button>
            </section>
        </fieldset>
    );

    function newLink(e: MouseEvent<HTMLButtonElement>) {
        const newLink: Link = {
            id: (NEW_LINK_ID--).toString(),
            name: "",
            typeLink: "LINK",
            url: "",

            // there is no need to fill the profile as it will not be sent when creating the link
            perfil: {} as Profile,
        };

        setProfileLinks(profileLinks.concat([newLink]));
    }

    function changeLinkType(e: ChangeEvent<HTMLSelectElement>) {
        const linkId = e.currentTarget.getAttribute("data-link-id")!;
        const newType = e.currentTarget.value as TypeLink;

        setProfileLinks(
            profileLinks.map<Link>(l => l.id === linkId
                ? {...l, typeLink: newType}
                : l
            )
        );
    }

    function removeLink(e: MouseEvent<HTMLButtonElement>) {
        const linkId = e.currentTarget.getAttribute("data-link-id")!;
        setProfileLinks(
            profileLinks.filter(l => l.id !== linkId)
        );
    }

}

export function getManageLinks(): Link[] {
    return Array
        .from(document.querySelectorAll("#fieldset-links .link-item"))
        .map(el => {
            const id = el.getAttribute("data-link-id")!;
            const name = el.querySelector('[data-link-field="name"]') as HTMLInputElement;
            const type = el.querySelector('[data-link-field="type"]') as HTMLSelectElement;
            const url = el.querySelector('[data-link-field="url"]') as HTMLInputElement;

            return {
                id,
                name: name.value,
                typeLink: type.value as TypeLink,
                url: url.value,

                // there is no need to fill the profile as it will not be sent when creating the link
                perfil: {} as Profile,
            };
        });
}
