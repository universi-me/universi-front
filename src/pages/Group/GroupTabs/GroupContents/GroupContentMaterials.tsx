import { useContext, useEffect, useState } from "react";
import UniversimeApi from "@/services/UniversimeApi";
import { GroupContext } from "@/pages/Group";
import * as SwalUtils from "@/utils/sweetalertUtils"
import { type Content } from "@/types/Capacity";

export function GroupContentMaterials() {
    const groupContext = useContext(GroupContext);
    const [materials, setMaterials] = useState<Content[]>();

    useEffect(() => {
        refreshMaterials();
    }, [groupContext?.currentContent?.id]);

    if (groupContext === null || materials === undefined) {
        return null;
    }

    return (
        <>{JSON.stringify(materials)}</>
    );

    function refreshMaterials() {
        const contentId = groupContext?.currentContent?.id;
        if (!contentId) {
            return;
        }

        UniversimeApi.Capacity.contentsInFolder({id: contentId})
            .then(response => {
                if (!response.success || !response.body) {
                    SwalUtils.fireModal({
                        titleText: "Erro ao acessar conteúdo",
                        text: response.message,
                        confirmButtonText: "Voltar aos conteúdos",
                    })
                        .then(result => {
                            if (result.isConfirmed)
                                groupContext.setCurrentContent(undefined);
                        })

                    return;
                }

                setMaterials(response.body.contents);
            });
    }
}
