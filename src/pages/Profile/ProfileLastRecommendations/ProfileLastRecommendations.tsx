import { useContext } from 'react';
import './ProfileLastRecommendations.css'
import { ProfileContext } from '../ProfileContext';
import { getFullName } from '@/utils/profileUtils';

const MAX_RECOMMENDATIONS_QUANTITY = 3;

export function ProfileLastRecommendations() {
    const profileContext = useContext(ProfileContext);
    if (profileContext === null)
        return null;

    return (
        <div className="last-recommendations">
            <h2 className="heading">Últimas Recomendações</h2>
            { profileContext.profileListData.recommendationsReceived.length > 0 ?
                <div className="list">
                    {
                        profileContext.profileListData.recommendationsReceived.map((recommendation, i) => {
                            if (i >= MAX_RECOMMENDATIONS_QUANTITY)
                                return null;

                            const hasOriginImage = recommendation.origin.image === null;
                            return (
                                <div className="recommendation" key={recommendation.id}>
                                    <div className="image" style={ hasOriginImage
                                        ? {backgroundImage: recommendation.origin.image as string}
                                        : {backgroundColor: "#8A8A8A"}
                                    } />

                                    <div className="box">
                                        <h2 className="user-name">{getFullName(recommendation.origin)}</h2>
                                        <h3 className="recommended-by">Recomendou pela competência:</h3>
                                        <h3 className="competence-name">{recommendation.competenceType.name}</h3>
                                    </div>

                                    <div className="quote-box">
                                        <p className="quote">{recommendation.description}</p>
                                        <img src="/assets/icons/quotes-1.svg" className="icon" />
                                    </div>
                                </div>
                            );
                        })
                    }
                    <button className="show-more">Ver mais</button>
                </div>
            : <p className="empty-recommendations">Nenhuma recomendação recebida.</p> }
        </div>
    );
}
