import { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import UniversimeApi from "@/services/UniversimeApi";
import { type ContentPageLoaderSuccess, type ContentPageLoaderResponse, ContentHeader, MaterialList, fetchContentPageData } from "@/pages/Content";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ContentContext, ContentContextType } from "./ContentContext";
import { ProfileInfo } from "@/components/ProfileInfo/ProfileInfo";
import { AuthContext } from "@/contexts/Auth";

import "./ContentPage.less";

export function ContentPage() {
    const loaderData = useLoaderData() as ContentPageLoaderResponse;
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const [context, setContext] = useState<ContentContextType>();

    useEffect(() => {
        if (loaderData.content) {
            setContext(makeContext(loaderData));
        } else if (context) {
            setContext(undefined);
        }
    }, [loaderData]);

    if (loaderData.content === undefined) {
        SwalUtils.fireModal({
            title: "Erro ao carregar conteúdo",
            confirmButtonText: "Voltar para a tela inicial",
            showConfirmButton: true,
            text: loaderData.reasons.length === 1
                ? loaderData.reasons[0]
                : loaderData.reasons.join("\n"),
        }).then(() => navigate("/"));
        return null;
    }

    /* Undefined on the first render */
    if (!context) return null;

    return (
        <ContentContext.Provider value={context}>
        <div id="content-page">
            <ProfileInfo profile={authContext.profile ?? undefined} organization={authContext.organization} links={authContext.profileLinks} groups={authContext.profileGroups} >
                <div id="content-page-content">
                    <ContentHeader />
                    <MaterialList />
                </div>
            </ProfileInfo>
        </div>
        </ContentContext.Provider>
    );

    function makeContext(data: ContentPageLoaderSuccess): ContentContextType {
        return {
            content: data.content,
            materials: data.materials,
            watchingProfile: data.beingWatched,

            async refreshAllData() {
                const res = await fetchContentPageData(this.content.reference, this.watchingProfile?.user.name);
                if (!res.content) return this;

                const newContext: ContentContextType = {
                    ...this,
                    content: res.content,
                    materials: res.materials,
                    watchingProfile: res.beingWatched,
                };

                setContext(newContext);
                return newContext;
            },

            async refreshContent() {
                const res = await UniversimeApi.Capacity.getFolder({ reference: this.content.reference });
                if (!res.success) return this;

                const newContext = {
                    ...this,
                    content: res.body.folder,
                };

                setContext(newContext);
                return newContext;
            },

            async refreshMaterials() {
                const res = await UniversimeApi.Capacity.contentsInFolder({ reference: this.content.reference });
                if (!res.success) return this;

                const newContext = {
                    ...this,
                    materials: res.body.contents,
                };

                setContext(newContext);
                return newContext;
            },

            editingSettings: undefined,
            setEditingSettings(set) {
                setContext({...this, editingSettings: set});
            },
        };
    }
}
