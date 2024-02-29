import { type LoaderFunctionArgs } from "react-router-dom";
import { type Paper, type Feature } from "@/types/Paper";
import UniversimeApi from "@/services/UniversimeApi";
import { ProfileClass, type Profile } from "@/types/Profile";

export type PaperResponse = {
    papers: Paper[] | undefined;
    features: Feature[] | undefined;
    participants: Profile[] | undefined;
};

export async function PaperFetch(organizationId: string): Promise<PaperResponse> {
    const papers = await UniversimeApi.Paper.list();
    const features = await UniversimeApi.Feature.list();
    
    const participants = await UniversimeApi.Group.participants({ groupId: organizationId });

    if(!papers.success || !features.success) {
        return FAILED_TO_LOAD;
    }

    return {
        papers: papers.body?.papers,
        features: features.body?.features,
        participants: participants.body?.participants,
    }
}

export async function PaperLoader(args: LoaderFunctionArgs) {

    const organization = await UniversimeApi.User.organization();

    if (!organization.success || !organization.body?.organization) {
        return {
            success: false,
            reason: organization.message,
        };
    }

    return PaperFetch(organization.body.organization.id);
}

const FAILED_TO_LOAD = {
    papers: undefined,
    features: undefined,
    participants: undefined
};
