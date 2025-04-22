import { UniversimeApi } from "@/services";
import { MouseEvent, useContext, useRef, useState } from "react";
import { DepartmentPageContext } from "../DepartmentPageContext";

import * as SwalUtils from "@/utils/sweetalertUtils";

export function DepartmentItem( props: Readonly<DepartmentItemProps> ) {
    const { department } = props;
    const context = useContext( DepartmentPageContext )!;

    const [ editMode, setEditMode ] = useState<boolean>( false );

    const editAcronymRef = useRef<HTMLInputElement>( null );
    const editNameRef = useRef<HTMLInputElement>( null );

    return <div className="department-item">
        <form className="department-form">
            <div className="edit-buttons">
                { editMode ? <SaveDepartment /> : <EditDepartmentButton /> }
            </div>
            { editMode ? <InputDepartmentData /> : <p className="department-name">{ `${department.acronym} – ${department.name}` }</p> }

            <div className="settings-buttons">
                <DeleteDepartment />
            </div>
        </form>
    </div>

    function SaveDepartment() {
        return <>
            <button title="Salvar mudanças" type="submit" onClick={save}>
                <i className="bi bi-floppy-fill"/>
            </button>
            <button title="Cancelar alterações" type="button" onClick={ () => setEditMode( false ) }>
                <i className="bi bi-x-circle"/>
            </button>
        </>

        async function save( e: MouseEvent<HTMLButtonElement> ) {
            e.preventDefault();
            await UniversimeApi.Department.update( department.id, { acronym: editAcronymRef.current!.value, name: editNameRef.current!.value } );
            await refresh();
        }
    }

    function EditDepartmentButton() {
        return <button type="button" title="Alterar nome do departamento" onClick={ () => setEditMode( true ) }>
            <i className="bi bi-pencil-square"/>
        </button>
    }

    function InputDepartmentData() {
        return <div className="form-inputs">
            <input type="text" name="acronym" id="acronym" defaultValue={ department.acronym } placeholder="Sigla" ref={ editAcronymRef } />
            <input type="text" name="name" id="name" defaultValue={ department.name } placeholder="Nome" ref={ editNameRef } />
        </div >
    }

    function DeleteDepartment() {
        return <button type="button" title="Excluir departamento" onClick={ deleteDepartment } className="delete-department">
            <i className="bi bi-trash-fill"/>
        </button>

        async function deleteDepartment( e: MouseEvent<HTMLButtonElement> ) {
            e.preventDefault();
            const modalRes = await SwalUtils.fireAreYouSure({
                title: `Deseja excluir o departamento "${department.acronym} - ${department.name}"?`,

                confirmButtonText: "Excluir",
                confirmButtonColor: "var(--font-color-alert)",
            });

            if ( modalRes.isConfirmed ) {
                await UniversimeApi.Department.remove( department.id );
                await refresh();
            }
        }
    }

    async function refresh() {
        await context.refreshDepartments();
        setEditMode( false );
    }
}

export type DepartmentItemProps = {
    department: Department.DTO;
};
