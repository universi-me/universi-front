import { UniversimeApi } from "@/services";
import { MouseEvent, useContext } from "react";
import { DepartmentPageContext } from "../DepartmentPageContext";

import * as SwalUtils from "@/utils/sweetalertUtils";

export function DepartmentItem( props: Readonly<DepartmentItemProps> ) {
    const { department } = props;
    const context = useContext( DepartmentPageContext )!;

    return <div className="department-item">
        <form className="department-form">
            <div className="edit-buttons">
                <button type="button" title="Alterar nome do órgão/área" onClick={ () => context.setEditDepartment( department ) }>
                    <i className="bi bi-pencil-square"/>
                </button>
            </div>
            <p className="department-name">{ `${department.acronym} – ${department.name}` }</p>

            <div className="settings-buttons">
                <button type="button" title="Excluir órgão/área" onClick={ deleteDepartment } className="delete-department">
                    <i className="bi bi-trash-fill"/>
                </button>
            </div>
        </form>
    </div>

    async function refresh() {
        await context.refreshDepartments();
        context.setEditDepartment( undefined );
    }

    async function deleteDepartment( e: MouseEvent<HTMLButtonElement> ) {
        e.preventDefault();
        const modalRes = await SwalUtils.fireAreYouSure({
            title: `Deseja excluir o órgão/área "${department.acronym} - ${department.name}"?`,

            confirmButtonText: "Excluir",
            confirmButtonColor: "var(--font-color-alert)",
        });

        if ( modalRes.isConfirmed ) {
            await UniversimeApi.Department.remove( department.id );
            await refresh();
        }
    }
}

export type DepartmentItemProps = {
    department: Department.DTO;
};
