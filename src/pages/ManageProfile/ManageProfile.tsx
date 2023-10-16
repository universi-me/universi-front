import { MouseEvent, useContext, useState } from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";

import UniversimeApi from "@/services/UniversimeApi";
import { ManageProfileLinks, ManageProfileLoaderResponse, ManageProfilePassword, ManageProfileImage, getManageLinks, getProfileImage } from "@/pages/ManageProfile";
import { setStateAsValue } from "@/utils/tsxUtils";
import { getProfileImageUrl } from "@/utils/profileUtils";
import { AuthContext } from "@/contexts/Auth";
import * as SwalUtils from "@/utils/sweetalertUtils";

import "./ManageProfile.less";

const BIO_MAX_LENGTH = 140;
export function ManageProfilePage() {
    const navigate = useNavigate();
    const { genderOptions, links, profile, typeLinks } = useLoaderData() as ManageProfileLoaderResponse;
    const authContext = useContext(AuthContext);

    const [firstname, setFirstname] = useState(profile?.firstname ?? "");
    const [lastname, setLastname] = useState(profile?.lastname ?? "");
    const [bio, setBio] = useState(profile?.bio ?? "");
    const [gender, setGender] = useState(profile?.gender ?? "");

    if (!profile)
        return <Navigate to="/login" />

    const isBioFull = (bio?.length ?? 0) >= BIO_MAX_LENGTH;
    const canSaveProfile = !!firstname && !!lastname;

    return <div id="manage-profile-page">
        <h1 className="heading">Editar meu perfil</h1>

        <div id="edit-profile-form">
            <div id="left-side">
                <form id="profile-edit" className="card">
                    <div className="image-name-container">
                        <ManageProfileImage currentImage={getProfileImageUrl(profile)} />

                        <fieldset id="fieldset-name">
                            <legend>Altere seu nome</legend>
                            <label className="legend" htmlFor="firstname">
                                <span className="required-input">Nome</span>
                                <input type="text" name="firstname" id="firstname" defaultValue={profile.firstname ?? ""} onChange={setStateAsValue(setFirstname)} required maxLength={255} />
                            </label>

                            <label className="legend" htmlFor="lastname">
                                <span className="required-input">Sobrenome</span>
                                <input type="text" name="lastname" id="lastname" defaultValue={profile.lastname ?? ""} onChange={setStateAsValue(setLastname)} required maxLength={255} />
                            </label>
                        </fieldset>
                    </div>


                    <fieldset id="fieldset-bio">
                        <legend>
                            Biografia
                            <span className={`info-text ${isBioFull ? 'full-bio' : ''}`}>{bio?.length ?? 0} / {BIO_MAX_LENGTH}</span>
                        </legend>
                        <textarea name="bio" id="bio" maxLength={BIO_MAX_LENGTH} defaultValue={bio} rows={6} onChange={setStateAsValue(setBio)} />
                    </fieldset>

                    <fieldset id="fieldset-gender">
                        <legend>Gênero</legend>
                        <select name="gender" id="gender" defaultValue={gender} onChange={setStateAsValue(setGender)} >
                            { genderOptions.map(g => {
                                return <option key={g.value} value={g.value}>{g.label}</option>
                            }) }
                        </select>
                    </fieldset>

                    <section id="submit-profile" className="submit">
                        <button type="button" onClick={submitProfileChanges}
                            disabled={!canSaveProfile} title={canSaveProfile ? undefined : "Preencha os campos obrigatórios marcados com *"}
                        >
                            Salvar alterações do perfil
                        </button>
                    </section>
                </form>

                <ManageProfilePassword />
            </div>
            <div id="right-side">
                <ManageProfileLinks profileLinks={links} typeLinks={typeLinks} submitLinks={submitLinkChanges} />
            </div>
        </div>
    </div>;

    async function submitProfileChanges(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!profile)
            return;

        let newImageUrl = undefined;
        const image = getProfileImage();
        if (image) {
            const res = await UniversimeApi.Image.upload({image});
            if (res.success && res.body) {
                newImageUrl = res.body.link;
            }
        }

        UniversimeApi.Profile.edit({
            profileId: profile.id,
            name: firstname,
            lastname,
            bio,
            gender: gender || undefined,
            imageUrl: newImageUrl,
        }).then(async res => {
            if (!res.success)
                throw new Error(res.message);

            const p = await authContext.updateLoggedUser();
            navigate(`/profile/${p!.user.name}`);
        }).catch((reason: Error) => {
            SwalUtils.fireModal({
                title: "Erro ao salvar alterações de perfil",
                text: reason.message,
                icon: 'error',
            });
        }) 
    }

    function submitLinkChanges(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!profile)
            return;

        const manageLinks = getManageLinks();

        const linksCreated = manageLinks
            .filter(l => {
                const idNum = Number(l.id);
                return !isNaN(idNum) && idNum < 0;
            })
            .map(l => UniversimeApi.Link.create(l));

        const linksRemoved = links
            .filter(l => undefined === manageLinks.find(ml => ml.id === l.id))
            .map(l => UniversimeApi.Link.remove(l));

        const linksUpdated = manageLinks
            .filter(l => {
                const oldLink = links.find(ol => ol.id === l.id);
                return !!oldLink && (oldLink.name !== l.name || oldLink.typeLink !== l.typeLink || oldLink.url !== l.url);
            })
            .map(l => UniversimeApi.Link.update(l));

        Promise.all([
            Promise.all(linksCreated),
            Promise.all(linksRemoved),
            Promise.all(linksUpdated),
        ]).then(res => {
            const failedCreate = res[0].filter(i => !i.success);
            const failedRemove = res[1].filter(i => !i.success);
            const failedUpdate = res[2].filter(i => !i.success);

            const errorBuilder: string[] = [];
            failedCreate.forEach(c => {
                errorBuilder.push(`Ao criar link: ${c.message}`);
            });

            failedRemove.forEach(c => {
                errorBuilder.push(`Ao remover link: ${c.message}`);
            });

            failedUpdate.forEach(c => {
                errorBuilder.push(`Ao atualizar link: ${c.message}`);
            });

            if (errorBuilder.length > 0)
                throw new Error(errorBuilder.join("<br/><br/>"));

            navigate(`/profile/${profile.user.name}`);
        }).catch((reason: Error) => {
            SwalUtils.fireModal({
                title: "Erro ao salvar seus links",
                html: reason.message,
                icon: "error",
            })
        })
    }
}
