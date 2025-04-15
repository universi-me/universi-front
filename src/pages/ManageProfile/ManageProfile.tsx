import { MouseEvent, useContext, useState } from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";

import { UniversimeApi } from "@/services"
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
    const { genderOptions, links, profile, typeLinks, departments } = useLoaderData() as ManageProfileLoaderResponse;
    const authContext = useContext(AuthContext);

    const [firstname, setFirstname] = useState(profile?.firstname ?? "");
    const [lastname, setLastname] = useState(profile?.lastname ?? "");
    const [bio, setBio] = useState(profile?.bio ?? "");
    const [gender, setGender] = useState<Profile.Gender | "">(profile?.gender ?? "");
    const [department, setDepartment] = useState<string>( profile?.department?.id ?? "" );

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
                        <select name="gender" id="gender" defaultValue={gender} onChange={ e => setGender( e.currentTarget.value as Gender | "" ) } >
                            { genderOptions.map(g => {
                                return <option key={g.value} value={g.value}>{g.label}</option>
                            }) }
                        </select>
                    </fieldset>

                    <fieldset id="fieldset-department">
                        <legend>Departamento</legend>
                        <select name="department" id="department" defaultValue={ department ?? "" } onChange={ e => setDepartment( e.currentTarget.value ) }>
                            <option value="">–</option>
                            { departmentOptions().map(d => {
                                return <option key={d.value} value={d.value}>{d.label}</option>
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

        let newImageUrl: string | undefined = undefined;
        if (image) {
            const res = await UniversimeApi.Image.upload({image});
            if (res.isSuccess() && res.body) {
                newImageUrl = res.data;
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

        UniversimeApi.Profile.update({
            firstname,
            lastname,
            biography: bio,
            gender: gender || undefined,
            image: newImageUrl,
            password,
            department,
        }).then(async res => {
            if (!res.isSuccess())
                throw new Error(res.errorMessage);

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
            .map(l => UniversimeApi.Link.create({
                name: l.name,
                type: l.typeLink,
                url: l.url,
            }));

        const linksRemoved = links
            .filter(l => undefined === manageLinks.find(ml => ml.id === l.id))
            .map(l => UniversimeApi.Link.remove( l.id ));

        const linksUpdated = manageLinks
            .filter(l => {
                const oldLink = links.find(ol => ol.id === l.id);
                return !!oldLink && (oldLink.name !== l.name || oldLink.typeLink !== l.typeLink || oldLink.url !== l.url);
            })
            .map(l => UniversimeApi.Link.update(l.id, {
                name: l.name,
                type: l.typeLink,
                url: l.url,
            }));

        Promise.all([
            Promise.all(linksCreated),
            Promise.all(linksRemoved),
            Promise.all(linksUpdated),
        ]).then(res => {
            const failedCreate = res[0].filter(i => !i.isSuccess());
            const failedRemove = res[1].filter(i => !i.isSuccess());
            const failedUpdate = res[2].filter(i => !i.isSuccess());

            const errorBuilder: string[] = [];
            failedCreate.forEach(c => {
                errorBuilder.push(`Ao criar link: ${c.errorMessage}`);
            });

            failedRemove.forEach(c => {
                errorBuilder.push(`Ao remover link: ${c.errorMessage}`);
            });

            failedUpdate.forEach(c => {
                errorBuilder.push(`Ao atualizar link: ${c.errorMessage}`);
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

    function departmentOptions() {
        return departments
            .map( d => ({ value: d.id, label: `${d.acronym} - ${d.name}` }) )
            .sort( ( d1, d2 ) => d1.label.localeCompare( d2.label ) );
    }
}
