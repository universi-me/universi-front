import { createContext } from "react";

export type DepartmentPageContextType = {
    departments: Nullable<Department.DTO[]>;

    refreshDepartments(): Promise<void>;
    setEditDepartment: React.Dispatch<React.SetStateAction<Possibly<Department.DTO>>>;
};

export const DepartmentPageContext = createContext<DepartmentPageContextType | undefined>( undefined );
