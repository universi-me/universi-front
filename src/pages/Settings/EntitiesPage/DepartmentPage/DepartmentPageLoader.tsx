import { UniversimeApi } from "@/services";

export async function DepartmentPageLoaderFetch(): Promise<DepartmentLoaderData> {
    const [ departmentListResponse ] = await Promise.all([
        UniversimeApi.Department.list(),
    ]);

    return {
        departments: departmentListResponse.body ?? null,
    };
}

export type DepartmentLoaderData = {
    departments: Nullable<Department.DTO[]>;
};
