import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProfileContext } from '@/pages/Profile';
import { ProfileImage } from '@/components/ProfileImage/ProfileImage';
import './ProfileLastRecommendations.css'
import { ProfileClass } from '@/types/Profile';

const MAX_RECOMMENDATIONS_QUANTITY = 3;

export function ProfileLastRecommendations() {
    const profileContext = useContext(ProfileContext);
    if (profileContext === null)
        return null;

    const recommendationsReceived = profileContext.profileListData.recommendationsReceived.map(r => ({ ...r, origin: new ProfileClass(r.origin), destiny: new ProfileClass(r.destiny) }));

    return (
        <div className="last-recommendations">
            <h2 className="heading">Últimas Recomendações</h2>
            { recommendationsReceived.length > 0 ?
                <div className="list">
                    {
                        recommendationsReceived.map((recommendation, i) => {
                            if (i >= MAX_RECOMMENDATIONS_QUANTITY)
                                return null;

                            const originUrl = `/profile/${recommendation.origin.user.name}`;
                            return (
                                <div className="recommendation" key={recommendation.id}>
                                    <Link to={originUrl} target='_blank'>
                                    <ProfileImage className="image" imageUrl={recommendation.origin.imageUrl} name={recommendation.origin.fullname} noImageColor='#8A8A8A' />
                                    </Link>

                                    <div className="box">
                                        <Link to={originUrl} target='_blank' className="user-name">{recommendation.origin.fullname}</Link>
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
