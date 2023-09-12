import { MouseEvent, useContext, useState } from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";

import { ManageProfileLoaderResponse } from "@/pages/ManageProfile";
import { AuthContext } from "@/contexts/Auth";
import { setStateAsValue } from "@/utils/tsxUtils";
import UniversimeApi from "@/services/UniversimeApi";

import "./ManageProfile.less";

const BIO_MAX_LENGTH = 140;
export function ManageProfilePage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { genderOptions } = useLoaderData() as ManageProfileLoaderResponse;

    const [firstname, setFirstname] = useState(auth.profile?.firstname ?? "");
    const [lastname, setLastname] =  useState(auth.profile?.lastname ?? "");
    const [bio, setBio] =  useState(auth.profile?.bio ?? "");
    const [gender, setGender] =  useState(auth.profile?.gender ?? "");

    if (!auth.user)
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

            <section id="submit">
                <button type="button" onClick={submitChanges}>
                    Alterar perfil
                </button>
            </section>
        </form>
    </div>;

    function submitChanges(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        const profile = auth.profile;
        if (!profile)
            return;

        UniversimeApi.Profile.edit({
            profileId: profile.id,
            name: firstname,
            lastname,
            bio,
            gender: !!gender ? gender : undefined,
        }).then(response => {
            if (response.success) {
                // todo: update auth.profile
                navigate(`/profile/${profile.user.name}`);
            }
            // todo: warn error
        })
    }
}
