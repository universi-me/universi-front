import { useReducer, useState, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import UniversimeApi from "@/services/UniversimeApi";
import { AuthContext } from "@/contexts/Auth";
import { SettingsTitle, type RolesPageLoaderResponse, RolesPageFetch, SettingsDescription } from "@/pages/Settings";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { setStateAsValue } from "@/utils/tsxUtils";
import { type OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";

import { ProfileClass, type Profile } from "@/types/Profile";
import { UserAccessLevelLabel, type UserAccessLevel } from "@/types/User";
import { type Optional } from "@/types/utils";
import "./RolesPage.less";

export function RolesPage() {
    const data = useLoaderData() as RolesPageLoaderResponse;
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [participants, participantsDispatch] = useReducer(participantsReducer, data.success ? data.participants.map(p => new ProfileOnList(p)) : undefined);
    const [filter, setFilter] = useState("");

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

    return <div id="roles-settings">
        <SettingsTitle>Configurar administradores</SettingsTitle>
        <SettingsDescription>Configure os níveis de acesso dos usuários do Universi.me</SettingsDescription>
        <section id="search-submit-wrapper">
            <input type="search" placeholder="Pesquisar usuário" onChange={setStateAsValue(setFilter)} />
            <button type="button" onClick={submitChanges} className="submit" disabled={!canSubmit} title={canSubmit ? undefined : "Faça uma alteração primeiro"}>Salvar mudanças</button>
        </section>

        <section id="participants-list">
        { filteredParticipants.map(profile => {
            const isOwnProfile = auth.profile!.id === profile.id;
            const roleLabel = UserAccessLevelLabel[profile.role];

            return <div className="profile-item" key={profile.id}>
                <ProfileImage imageUrl={profile.imageUrl} className="profile-image" />
                <div className="info">
                    <h2 className="profile-name">{profile.fullname}</h2>
                    <p className="profile-bio">{profile.bio}</p>
                </div>
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

            return new ProfileOnList(p, action.setRole);
        });
    }

    async function refreshParticipants() {
        const response = await RolesPageFetch(auth.organization!.id);
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
            changedParticipants.map(p => UniversimeApi.Admin.editAccount({ userId: p.user.id, authorityLevel: p.role }))
        );

        refreshParticipants();

        const failedChanges = responses.filter(r => !r.success);
        if (failedChanges.length === 0)
            return;

        const messages = failedChanges
            .map(err => err.message)
            .filter(m => m !== undefined);

        SwalUtils.fireModal({
            title: "Erro ao alterar administradores",
            text: messages.join("\n"),
        });
    }
}

class ProfileOnList extends ProfileClass {
    public newRole?: UserAccessLevel;

    /**
     * Returns the current role of the profile, which can be the modified before saving or the original
     */
    get role() {
        return this.newRole ?? this.user.accessLevel!;
    }

    /**
     * Returns true if the profile has a new role and it's different from the original role
     */
    get changed() {
        return this.newRole && this.newRole !== this.user.accessLevel;
    }

    constructor(profile: Profile, newRole?: UserAccessLevel) {
        super(profile);
        this.newRole = newRole;
    }
}

type ParticipantsReducerAction = {
    type: "SET_ROLE";
    setRole:   UserAccessLevel;
    profileId: string;
} | {
    type: "SET_ALL";
    setParticipants: Optional<ProfileOnList[]>;
};
