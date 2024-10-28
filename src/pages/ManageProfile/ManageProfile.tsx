import { MouseEvent, useContext, useState } from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";

import UniversimeApi from "@/services/UniversimeApi";
import { ManageProfileLinks, ManageProfileLoaderResponse, ManageProfilePassword, ManageProfileImage, getManageLinks } from "@/pages/ManageProfile";
import { setStateAsValue } from "@/utils/tsxUtils";
import { AuthContext } from "@/contexts/Auth";
import * as SwalUtils from "@/utils/sweetalertUtils";

import "./ManageProfile.less";

const BIO_MAX_LENGTH = 140;
const FIRST_NAME_MAX_LENGTH = 21;
const LAST_NAME_MAX_LENGTH = 21;
export function ManageProfilePage() {
    const navigate = useNavigate();
    const { genderOptions, links, profile, typeLinks } = useLoaderData() as ManageProfileLoaderResponse;
    const authContext = useContext(AuthContext);

    const [firstname, setFirstname] = useState(profile?.firstname ?? "");
    const [lastname, setLastname] = useState(profile?.lastname ?? "");
    const [bio, setBio] = useState(profile?.bio ?? "");
    const [gender, setGender] = useState(profile?.gender ?? "");

    // undefined means the profile image was unchanged, while a `File` value means it was changed
    const [image, setImage] = useState<File | undefined>(undefined);

    if (!profile)
        return <Navigate to="/login" />

    const isBioFull = (bio?.length ?? 0) >= BIO_MAX_LENGTH;
    const isFirstnameFull = (firstname.length) >= FIRST_NAME_MAX_LENGTH;
    const isLastnameFull = (lastname.length) >= LAST_NAME_MAX_LENGTH;

    const hasImage = (image !== undefined) || !!profile.image;
    const canSaveProfile = !!firstname && !!lastname;

    return <div id="manage-profile-page">
        <h1 className="heading">Editar meu perfil</h1>

        <div id="edit-profile-form">
            <div id="left-side">
                <form id="profile-edit" className="card">
                    <div className="image-name-container">
                        <ManageProfileImage currentImage={profile.imageUrl} setImage={setImage} name={profile.fullname} />

                        <fieldset id="fieldset-name">
                            <legend>Altere seu nome</legend>
                            <label className="legend" htmlFor="firstname">
                                <span className="counter-wrapper">
                                    <span className="required-input">Nome</span>
                                    <span className={`counter ${isFirstnameFull ? 'full-counter' : ''}`}>{firstname.length} / {FIRST_NAME_MAX_LENGTH}</span>
                                </span>
                                <input type="text" name="firstname" id="firstname" defaultValue={profile.firstname ?? ""} onChange={setStateAsValue(setFirstname)} required maxLength={FIRST_NAME_MAX_LENGTH} />
                            </label>

                            <label className="legend" htmlFor="lastname">
                                <span className="counter-wrapper">
                                    <span className="required-input">Sobrenome</span>
                                    <span className={`counter ${isLastnameFull ? 'full-counter' : ''}`}>{lastname.length} / {LAST_NAME_MAX_LENGTH}</span>
                                </span>

                                <input type="text" name="lastname" id="lastname" defaultValue={profile.lastname ?? ""} onChange={setStateAsValue(setLastname)} required maxLength={LAST_NAME_MAX_LENGTH} />
                            </label>
                        </fieldset>
                    </div>


                    <fieldset id="fieldset-bio">
                        <legend>
                            Biografia
                            <span className={`info-text ${isBioFull ? 'full-counter' : ''}`}>{bio?.length ?? 0} / {BIO_MAX_LENGTH}</span>
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
        if (image) {
            const res = await UniversimeApi.Image.upload({image});
            if (res.success && res.body) {
                newImageUrl = res.body.link;
            }
        }

        let hasPassword = authContext.user?.hasPassword ?? false;
        const { value: password, isConfirmed } = !hasPassword ? {value: null, isConfirmed: true} : await SwalUtils.fireModal({
            title: "Edição de perfil",
            input: "password",
            inputLabel: "Inserir senha para salvar as alterações",
            inputPlaceholder: "Insira sua senha",
            confirmButtonText: "Confirmar Alterações",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            allowOutsideClick: true,
            showCloseButton: true,
            inputAttributes: {
              autocapitalize: "off",
              autocorrect: "off"
            }
        });
        if (!isConfirmed)
            return;

        UniversimeApi.Profile.edit({
            profileId: profile.id,
            name: firstname,
            lastname,
            bio,
            gender: gender || undefined,
            imageUrl: newImageUrl,
            rawPassword: password,
        }).then(async res => {
            if (!res.success)
                throw new Error(res.message);

            const p = await authContext.updateLoggedUser();
            navigate(`/profile/${p!.user.name}`);
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
