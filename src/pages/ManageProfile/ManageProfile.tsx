import { MouseEvent, useState } from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";

import { ManageProfileLinks, ManageProfileLoaderResponse, ManageProfilePassword, ManageProfileImage, getManageLinks, getProfileImage } from "@/pages/ManageProfile";
import { setStateAsValue } from "@/utils/tsxUtils";
import UniversimeApi from "@/services/UniversimeApi";

import "./ManageProfile.less";
import { getProfileImageUrl } from "@/utils/profileUtils";

const BIO_MAX_LENGTH = 140;
export function ManageProfilePage() {
    const navigate = useNavigate();
    const { genderOptions, links, profile, typeLinks } = useLoaderData() as ManageProfileLoaderResponse;

    const [firstname, setFirstname] = useState(profile?.firstname ?? "");
    const [lastname, setLastname] = useState(profile?.lastname ?? "");
    const [bio, setBio] = useState(profile?.bio ?? "");
    const [gender, setGender] = useState(profile?.gender ?? "");

    if (!profile)
        return <Navigate to="/login" />

    const isBioFull = (bio?.length ?? 0) >= BIO_MAX_LENGTH;

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
                                Nome
                                <input type="text" name="firstname" id="firstname" defaultValue={firstname} onChange={setStateAsValue(setFirstname)} />
                            </label>

                            <label className="legend" htmlFor="lastname">
                                Sobrenome
                                <input type="text" name="lastname" id="lastname" defaultValue={lastname} onChange={setStateAsValue(setLastname)} />
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
                        <button type="button" onClick={submitProfileChanges}>
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
        }).then(res => {
            // todo: warn on error
            navigate(`/profile/${profile.user.name}`);
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
            // todo: add warning on error
            navigate(`/profile/${profile.user.name}`)
        })
    }
}
