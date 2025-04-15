import { UniversimeApi } from "@/services";
import { LoaderFunctionArgs } from "react-router";

export type SignUpPageData = {
    departments: Department.DTO[];
};

export async function fetchSignUpPageData(): Promise<SignUpPageData> {
    const [ fetchDepartments ] = await Promise.all([
        UniversimeApi.Department.list(),
    ]);

    return {
        departments: fetchDepartments.body ?? [],
    };
}

export async function SignUpPageLoader( args: LoaderFunctionArgs ): Promise<SignUpPageData> {
    return fetchSignUpPageData();
}
