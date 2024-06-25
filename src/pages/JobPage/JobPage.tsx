import { useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

import { AuthContext } from "@/contexts/Auth";
import { ProfileInfo } from "@/components/ProfileInfo/ProfileInfo";

import {
    JobContext, JobContextType, JobHeader, JobCompetences, JobShortDescription,
    JobLongDescription, JobPageLoaderResponse
} from "@/pages/JobPage";

export function JobPage() {
    const data = useLoaderData() as JobPageLoaderResponse;
    const auth = useContext(AuthContext);

    const [context, setContext] = useState(makeContext(data));
    useEffect(() => {
        setContext(makeContext(data));
    }, [data])

    // todo: failed to load page
    if (!context) return <div>
        Fail
    </div>

    return <JobContext.Provider value={context}>
        <ProfileInfo id="job-page" profile={auth.profile ?? undefined} links={auth.profileLinks} organization={auth.organization} groups={auth.profileGroups}>
            <section id="job-content">
                <JobHeader />
                <JobCompetences />

                <JobShortDescription />
                <JobLongDescription />
            </section>
        </ProfileInfo>
    </JobContext.Provider>

    function makeContext(data: JobPageLoaderResponse): JobContextType | undefined {
        if (!data.success) return undefined;
        else return {
            job: data.job,
        }
    }
}
