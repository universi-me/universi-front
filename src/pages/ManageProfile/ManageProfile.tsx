import { MouseEvent, useState } from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";

import { ManageProfileLinks, ManageProfileLoaderResponse, getManageLinks } from "@/pages/ManageProfile";
import { setStateAsValue } from "@/utils/tsxUtils";
import UniversimeApi from "@/services/UniversimeApi";

import "./ManageProfile.less";

const BIO_MAX_LENGTH = 140;
export function ManageProfilePage() {
    const navigate = useNavigate();
    const { genderOptions, links, profile, typeLinks } = useLoaderData() as ManageProfileLoaderResponse;

    const [firstname, setFirstname] = useState(profile?.firstname ?? "");
    const [lastname, setLastname] =  useState(profile?.lastname ?? "");
    const [bio, setBio] =  useState(profile?.bio ?? "");
    const [gender, setGender] =  useState(profile?.gender ?? "");

    if (!profile)
        return <Navigate to="/login" />

    const isBioFull = (bio?.length ?? 0) >= BIO_MAX_LENGTH;

    return <div id="manage-profile-page">
        <h1 className="heading">Editar meu perfil</h1>

        <form id="edit-profile-form">
            <fieldset id="fieldset-name">
                <legend>Nome</legend>
                <input type="text" name="firstname" id="firstname" defaultValue={firstname} onChange={setStateAsValue(setFirstname)} />
                <input type="text" name="lastname" id="lastname" defaultValue={lastname} onChange={setStateAsValue(setLastname)} />
            </fieldset>

            <fieldset id="fieldset-bio">
                <legend>Biografia</legend>
                <textarea name="bio" id="bio" maxLength={BIO_MAX_LENGTH} defaultValue={bio} onChange={setStateAsValue(setBio)} />
                <p className={`info-text ${isBioFull ? 'full-bio' : ''}`}>{bio?.length ?? 0} / {BIO_MAX_LENGTH}</p>
            </fieldset>

            <fieldset id="fieldset-gender">
                <legend>Gênero</legend>
                <select name="gender" id="gender" defaultValue={gender} onChange={setStateAsValue(setGender)} >
                    { genderOptions.map(g => {
                        return <option key={g.value} value={g.value}>{g.label}</option>
                    }) }
                </select>
            </fieldset>

            <ManageProfileLinks profileLinks={links} typeLinks={typeLinks} />

            <section id="submit">
                <button type="button" onClick={submitChanges}>
                    Alterar perfil
                </button>
            </section>
        </form>
    </div>;

    function submitChanges(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (!profile)
            return;

        const profileEdit = UniversimeApi.Profile.edit({
            profileId: profile.id,
            name: firstname,
            lastname,
            bio,
            gender: gender || undefined,
        });

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
            profileEdit,
            Promise.all(linksCreated),
            Promise.all(linksRemoved),
            Promise.all(linksUpdated),
        ])
            .then(res => {
                // todo: add warning on error
                navigate(`/profile/${profile.user.name}`)
            })
    }
}
