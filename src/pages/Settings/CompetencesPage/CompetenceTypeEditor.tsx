import { type MouseEvent, useEffect, useState } from "react";

import UniversimeApi from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { makeClassName, setStateAsValue } from "@/utils/tsxUtils";

import { type CompetenceType } from "@/types/Competence";

export type CompetenceTypeEditorProps = {
    /** CompetenceType being edited */
    ct: CompetenceType;

    /** Function to update current CompetenceTypes available */
    refreshCompetenceTypes: () => any;
};

export function CompetenceTypeEditor(props: Readonly<CompetenceTypeEditorProps>) {
    const { ct, refreshCompetenceTypes } = props;

    const [nameInput, setNameInput] = useState<string>();
    const renderNameChange = nameInput !== undefined;

    /* On click edit focus on the input */
    useEffect(() => {
        if (nameInput === undefined) return;

        document
            .querySelector(`.competence-editor[data-competence-name="${ct.name}"] form.competence-editing-form`)
            ?.getElementsByTagName("input")
            .item(0)?.focus();
    }, [nameInput]);

    const reviewTitle = ct.reviewed
        ? "Essa competência já foi revisada por um administrador"
        : "Clique para aprovar essa competência";

    const reviewAction = ct.reviewed
        ? () => {}
        : reviewCompetence;

    return <div className="competence-editor" data-competence-name={ct.name}>
        { renderNameChange ||
        <button disabled={ct.reviewed} title={reviewTitle} onClick={reviewAction} className="competence-interact-button">
            <i className={makeClassName("bi", ct.reviewed ? "bi-check-circle-fill" : "bi-check-circle")} />
        </button>
        }

        <h2>
            { renderNameChange
                ? <form className="competence-editing-form competencetype-name-wrapper">
                    <button type="submit" className="competence-interact-button" onClick={saveNameChange} title="Salvar mudanças">
                        <i className="bi bi-floppy-fill"/>
                    </button>
                    <button type="reset" className="competence-interact-button competence-cancel-name" onClick={() => setNameInput(undefined)} title="Cancelar mudanças">
                        <i className="bi bi-x-circle"/>
                    </button>
                    <input type="text" className="competence-name-input competencetype-name" defaultValue={ct.name} onChange={setStateAsValue(setNameInput)} />
                </form>
                : <div className="competencetype-name-wrapper">
                    <button type="button" className="competence-interact-button" onClick={() => setNameInput(ct.name)} title="Alterar nome da competência">
                        <i className="bi bi-pencil-square"/>
                    </button>
                    <h3 className="competencetype-name"> { ct.name } </h3>
                </div>
            }
        </h2>

        <button type="button" className="competence-interact-button competencetype-delete" onClick={deleteCompetenceType} title="Excluir competência">
            <i className="bi bi-trash-fill"/>
        </button>
    </div>

    async function reviewCompetence() {
        const response = await SwalUtils.fireModal({
            title: `Deseja aprovar a competência "${ct.name}"?`,
            text: "Essa competência se tornará visível para todos os usuários do Universi.me.",

            showConfirmButton: true,
            confirmButtonText: "Aprovar competência",
            showCancelButton: true,
            cancelButtonText: "Cancelar ação"
        });

        if (!response.isConfirmed)
            return;

        await UniversimeApi.CompetenceType.update({ id: ct.id, reviewed: true });
        await refreshCompetenceTypes();
    }

    async function saveNameChange(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (nameInput === undefined)
            return;

        await UniversimeApi.CompetenceType.update({ id: ct.id, name: nameInput });
        await refreshCompetenceTypes();
        setNameInput(undefined);
    }

    async function deleteCompetenceType() {
        const response = await SwalUtils.fireModal({
            title: `Deseja excluir a competência "${ct.name}"?`,
            text: "Essa ação não pode ser desfeita",

            showConfirmButton: true,
            confirmButtonText: "Excluir",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
        });

        if (!response.isConfirmed)
            return;

        await UniversimeApi.CompetenceType.remove({ id: ct.id });
        await refreshCompetenceTypes();
    }
}
