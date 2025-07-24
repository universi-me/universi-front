import { useReducer, useState, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { UniversimeApi } from "@/services"
import { AuthContext } from "@/contexts/Auth";
import { SettingsTitle, type RolesPageLoaderResponse, RolesPageFetch, SettingsDescription } from "@/pages/Settings";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { setStateAsValue } from "@/utils/tsxUtils";
import { type OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";

import { ProfileClass } from "@/types/Profile";
import { UserAccessLevelLabel } from "@/types/User";
import "./RolesPage.less";
import UniversiForm from "@/components/UniversiForm";

export function RolesPage() {
    const data = useLoaderData() as RolesPageLoaderResponse;
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [participants, participantsDispatch] = useReducer(participantsReducer, data.success ? data.participants.map(p => new ProfileOnList(p)) : undefined);
    const [filter, setFilter] = useState("");

    const [selectionProfile, setSelectionProfile] = useState<Profile[]>([]);
    const [isSelectionActive, setIsSelectionActive] = useState(false);

    const [showActionPopup, setShowActionPopup] = useState(false);
    const [actionSelectionBlock, setActionSelectionBlock] = useState(false);

    const [showOptionProfilePopup, setShowOptionProfilePopup] = useState(false);
    const [optionProfile, setOptionProfile] = useState<Profile>();

    if (!participants) {
        SwalUtils.fireModal({
            title: "Erro ao recuperar dados dos participantes",
            text: data.success === false ? data.reason : undefined,

            showConfirmButton: true,
            confirmButtonText: "Voltar",
        }).then(res => navigate("/settings"));
        return null;
    }

    const changedParticipants = participants.filter(p => p.changed);

    const filteredParticipants = participants
        .filter(p => p.firstname?.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
        .sort(ProfileOnList.compare);

    const CHANGE_ROLE_OPTIONS: OptionInMenu<Profile>[] = Object.entries(UserAccessLevelLabel).map(([role, label]) => ({
        text: label,
        onSelect(data) {
            participantsDispatch({
                type: "SET_ROLE",
                profileId: data.id,
                setRole: role as UserAccessLevel,
            });
        },
    }));

    const canSubmit = changedParticipants.length > 0;

    function startSelection() {
        setIsSelectionActive(true);
    }

    function applySelection() {
        selectionProfile.forEach(p => {
            participantsDispatch({
                type: "SET_ROLE",
                profileId: p.id,
                setRole: undefined,
                setBlockedAccount: actionSelectionBlock,
            });
        });
        cancelSelection();
    }

    function blockProfile(profile: ProfileOnList, blocked: boolean) {
        participantsDispatch({
            type: "SET_ROLE",
            profileId: profile.id,
            setBlockedAccount: blocked,
        });
    }

    function addSelection(profile: Profile) {
        setSelectionProfile([...selectionProfile, profile]);
    }

    function removeSelection(profile: Profile) {
        setSelectionProfile(selectionProfile.filter(p => p.id !== profile.id));
    }

    function isSelectionProfile(profile: Profile) {
        return selectionProfile.some(p => p.id === profile.id);
    }

    function toggleSelection(profile: Profile) {
        if (isSelectionProfile(profile))
            removeSelection(profile);
        else
            addSelection(profile);
    }

    function showSelectionAction() {
        setShowActionPopup(true);
    }

    function cancelSelection() {
        setIsSelectionActive(false);
        setSelectionProfile([]);
        setShowActionPopup(false);
    }

    function selectAllProfiles() {
        setSelectionProfile(filteredParticipants!.map(p => p));
    }

    function cleanSelection() {
        setSelectionProfile([]);
    }

    function cancelChanges() {
        participantsDispatch({ type: "SET_ALL", setParticipants: participants!.map(p => new ProfileOnList(p)) });
    }

    function showOptionsProfile(profile: ProfileOnList) {
        setOptionProfile(profile);
        setShowOptionProfilePopup(true);
    }

    async function handleOptionsAccount( data: UniversiForm.Data<UniversimeApi.User.UserAccountUpdate_RequestDTO> ) {
        if ( !data.confirmed ) {
            setShowOptionProfilePopup(false)
            return;
        }
        await UniversimeApi.User.updateAccount({ userId: data.body!.userId, password: data.body!.password })
        setShowOptionProfilePopup(false)
    }

    return <div id="roles-settings">

        {   showOptionProfilePopup &&
        <UniversiForm.Root id="profile-options-modal" title="Opções do Usuário" callback={ handleOptionsAccount } >
            <UniversiForm.Input.Hidden
                param="userId"
                defaultValue={ optionProfile?.user.id }
            />
            <UniversiForm.Input.Text
                param="username"
                label="Usuário"
                value={optionProfile?.user.name}
                disabled
            />
            <UniversiForm.Input.Text
                param="email"
                label="E-mail"
                value={optionProfile?.user.email}
                disabled
            />
            <UniversiForm.Input.Password
                param="password"
                label="Definir Senha Temporária"
                passwordPlaceholder="Insira uma senha temporária"
                confirmPlaceholder="Confirme a senha temporária"
                required
                mustConfirm
                mustMatchRequirements
            />
        </UniversiForm.Root> }

        <SettingsTitle>Configurar administradores</SettingsTitle>
        <SettingsDescription>Configure os níveis de acesso dos usuários do Universi.me</SettingsDescription>
        <section id="search-submit-wrapper">
            <input type="search" placeholder="Pesquisar usuário" onChange={setStateAsValue(setFilter)} />
            <button type="button" onClick={submitChanges} className="submit" disabled={!canSubmit} title={canSubmit ? undefined : "Faça uma alteração primeiro"}>Salvar mudanças</button>
            {
                canSubmit &&
                <button type="button" onClick={cancelChanges} className="submit">Cancelar Mudanças</button>
            }
        </section>

        <section id="search-submit-wrapper">
            { isSelectionActive ?
                <>
                    {!showActionPopup && selectionProfile.length ?
                    <>
                        <button type="button" onClick={showSelectionAction} className="submit"><h2 className="bi-grip-vertical" />Ação para Seleção</button>
                    </>
                    :
                    <>
                        
                    </>
                    }

                    { selectionProfile.length ?
                        <button type="button" className="submit" onClick={() => cleanSelection()} style={{display: 'inline-block' }}>
                            <span className="bi bi-eraser-fill"/> Limpar seleção {selectionProfile.length ?  ' ('+selectionProfile.length+' perfis)' : ''}
                        </button>
                    :
                        <button type="button" className="submit" onClick={() => selectAllProfiles()} style={{display: 'inline-block' }}>
                            <span className="bi bi-plus-circle-dotted"/> Selecionar Tudo
                        </button>
                    }

                    <button type="button" onClick={cancelSelection} className="submit"><h2 className="bi-x-circle" />Cancelar Seleção</button>
                </>
                :
                    <button type="button" onClick={startSelection} className="submit"><h2 className="bi-check2-all" />Selecionar</button>
            }
        </section>

        { (showActionPopup && isSelectionActive) && <>
        <div className="actions-popup" style={{backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 10, padding: 10, marginBottom: 20}}>
                <section id="search-submit-wrapper" style={{display: 'block'}}>

                    <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 20}}>
                    <h3>Ação para a seleção{selectionProfile.length ?  ' ('+selectionProfile.length+' perfis)' : '' }: </h3>
                    <button type="button" className="submit" onClick={() => setActionSelectionBlock(!actionSelectionBlock)} style={{display: 'inline-block' }}>
                        { actionSelectionBlock ? <><span className="bi bi-lock-fill"/> Bloqueado</> : <><span className="bi bi-unlock-fill"/> Habilitado</> }
                    </button>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
                        <button type="button" className="submit" onClick={() => applySelection()} style={{display: 'inline-block' }}>
                            <span className="bi bi-check2-all"/> Aplicar seleção
                        </button>
                    </div>
                </section>
        </div>
        </>
        }

        <section id="participants-list">
        { filteredParticipants.map(profile => {
            const isOwnProfile = auth.profile!.id === profile.id;
            const roleLabel = UserAccessLevelLabel[profile.accessLevel];

            return <div className="profile-item" key={profile.id}>
                <div style={{  display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between',  width: '100%', }}>

                <div style={{margin: 0, padding: 0, width: '5%'}}>
                    { isSelectionActive && <h2 onClick={() => toggleSelection(profile) } className={isSelectionProfile(profile) ? "bi-check-circle-fill" : "bi-check-circle"} /> }
                    { profile.blockedAccount && <><br/><h2 className="bi bi-x-octagon-fill" style={{color: 'red', paddingRight: '2em'}}/></> }
                </div>

                <div style={{width: '15%'}}>
                    <ProfileImage imageUrl={profile.imageUrl} name={profile.fullname} className="profile-image" />
                </div>

                <div className="info" style={{width: '40%'}}>
                    <h2 className="profile-name">{profile.fullname}</h2>
                    <p className="profile-bio">{profile.bio}</p>
                </div>
                
                <div style={{display: 'flex', padding: 0, alignItems: 'center'}}>

                <div style={{  marginRight: 5,}}>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild disabled={isOwnProfile} title={isOwnProfile ? "Você não pode alterar seu próprio nível de acesso" : undefined}>
                        <button type="button" className="set-role-trigger">
                            { roleLabel }
                            <span className="bi"/>
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content className="set-role-menu">
                        { CHANGE_ROLE_OPTIONS.map(def => renderOption(profile, def)) }
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                </div>

                <div>
                    <section id="search-submit-wrapper" style={{marginBottom: 'auto'}}>
                        <button type="button" className="submit" onClick={() => blockProfile(profile, !profile.blockedAccount)} style={{display: 'inline-block', backgroundColor: profile.blockedAccount ? 'red' : 'var(--primary-color)' }}>
                            { profile.blockedAccount ? <><span className="bi bi-lock-fill"/> Bloqueado</> : <><span className="bi bi-unlock-fill"/> Habilitado</> }
                        </button>
                        <span  style={{paddingLeft: 10}}/>
                        <button type="button" className="submit" onClick={() => showOptionsProfile(profile)} style={{ padding: 10, width: 'auto', backgroundColor: 'var(--primary-color)' }}>
                            <span className="bi bi-three-dots-vertical"/>
                        </button>
                    </section>
                </div>

                </div>

                </div>
            </div>
        }) }
        </section>
    </div>

    function participantsReducer(state: Optional<ProfileOnList[]>, action: ParticipantsReducerAction): Optional<ProfileOnList[]> {
        if (state === undefined || data.success === false)
            return undefined;

        if (action.type === "SET_ALL") {
            return action.setParticipants;
        }

        return state.map(p => {
            if (p.id !== action.profileId)
                return p;

            return new ProfileOnList(p, action.setRole, action.setBlockedAccount);
        });
    }

    async function refreshParticipants() {
        const response = await RolesPageFetch(auth.organization.id!);
        participantsDispatch({
            type: "SET_ALL",
            setParticipants: response.success
                ? response.participants.map(p => new ProfileOnList(p))
                : undefined,
        });
    }

    async function submitChanges() {
        if (!participants)
            return;

        const responses = await Promise.all(
            changedParticipants.map(p => UniversimeApi.User.updateAccount({ userId: p.user.id, authorityLevel: p.accessLevel, blockedAccount: p.blockedAccount}))
        );

        refreshParticipants();

        const failedChanges = responses.filter(r => !r.isSuccess());
        if (failedChanges.length === 0)
            return;

        const messages = failedChanges
            .map(err => err.errorMessage)
            .filter(m => m !== undefined);

        SwalUtils.fireModal({
            title: "Erro ao alterar administradores",
            text: messages.join("\n"),
        });
    }
}

class ProfileOnList extends ProfileClass {
    public newRole?: UserAccessLevel;
    public newBlockedAccount?: boolean;

    /**
     * Returns the current role of the profile, which can be the modified before saving or the original
     */
    get accessLevel(): UserAccessLevel {
        return this.newRole ?? this.user.accessLevel!;
    }

    /**
     * Returns the current blocked_account status of the profile, which can be the modified before saving or the original
     */
    get blockedAccount() {
        return this.newBlockedAccount ?? this.user.blocked_account;
    }

    /**
     * Returns true if the profile has a new role and it's different from the original role
     */
    get changed() {
        return (this.newRole && this.newRole !== this.user.accessLevel) ||
                 (this.newBlockedAccount !== undefined && (this.newBlockedAccount !== this.user.blocked_account));
    }

    constructor(profile: Profile, newRole?: UserAccessLevel, newBlockedAccount?: boolean) {
        super(profile);
        this.newRole = newRole;
        this.newBlockedAccount = newBlockedAccount;
    }
}

type ParticipantsReducerAction = {
    type: "SET_ROLE";
    setRole?:   UserAccessLevel;
    setBlockedAccount?: boolean;
    profileId: string;
} | {
    type: "SET_ALL";
    setParticipants: Optional<ProfileOnList[]>;
};
