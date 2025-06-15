import { useContext, useMemo } from "react";

import { ProfileContext } from "@/pages/Profile";
import ManageCompetence from "@/components/ManageCompetence";

export function CompetencesSettings() {
    const profileContext = useContext(ProfileContext)
    const editCompetence = profileContext?.editCompetence ?? null;

    const removedCompetenceTypes = useMemo( () => {
        return profileContext?.profileListData.competences
            .filter( c => c.competenceType.id !== editCompetence?.competenceType.id )
            .map( c => c.competenceType.id );
    }, [ profileContext?.profileListData.competences ] );

    return profileContext && <ManageCompetence
        competence={ editCompetence }
        removeTypes={ removedCompetenceTypes }
        callback={ res => res?.isSuccess()
            ? profileContext.reloadPage()
            : profileContext.setEditCompetence( undefined )
        }
    />;
}
