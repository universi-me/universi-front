import { createContext } from "react";

export type DepartmentPageContextType = {
    departments: Nullable<Department.DTO[]>;

    refreshDepartments(): Promise<void>;
};

export const DepartmentPageContext = createContext<DepartmentPageContextType | undefined>( undefined );
