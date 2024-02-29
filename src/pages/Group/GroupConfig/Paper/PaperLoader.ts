import { type LoaderFunctionArgs } from "react-router-dom";
import { useContext } from "react";
import { PaperProfile, type Paper } from "@/types/Paper";
import UniversimeApi from "@/services/UniversimeApi";
import { AuthContext } from "@/contexts/Auth";

export type PaperResponse = {
    papers: Paper[] | undefined;
    participants: PaperProfile[] | undefined;
};

export async function PaperFetch(groupId: string): Promise<PaperResponse> {

    const papers = await UniversimeApi.Paper.list({ groupId });
    
    const participants = await UniversimeApi.Paper.listPaticipants({ groupId });

    if(!papers.success ) {
        return FAILED_TO_LOAD;
    }

    return {
        papers: papers.body?.papers,
        participants: participants.body?.participants,
    }
}

export async function PaperLoader(args: LoaderFunctionArgs) {

    const auth = useContext(AuthContext);

    const organization = auth.organization;

    if (auth.profile === null || organization === null) {
        return {
            success: false,
            reason: null,
        };
    }

    return PaperFetch(organization!.id);
}

const FAILED_TO_LOAD = {
    papers: undefined,
    participants: undefined
};
