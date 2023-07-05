import './ProfileLastRecommendations.css'

export type ProfileLastRecommendationsProps = {
    recommendations: string[];
};

export function ProfileLastRecommendations(props: ProfileLastRecommendationsProps) {
    return (
        <div className="last-recommendations">
            <h2 className="heading">Últimas Recomendações</h2>
            <div className="list">
                {
                    props.recommendations.map(recommendation => {
                        return (
                            <div className="recommendation">
                                {/* todo: profile image from API */}
                                <div className="image" style={{backgroundColor: "#8A8A8A"}} />

                                <div className="box">
                                    {/* todo: user name from API */}
                                    <h2 className="user-name">{"Usuário Aleatório"}</h2>
                                    <h3 className="recommended-by">Recomendou pela competência:</h3>
                                    {/* todo: competence name */}
                                    <h3 className="competence-name">{"Nome da competência"}</h3>
                                </div>

                                <div className="quote-box">
                                    {/* todo: quote from API */}
                                    <p className="quote">{"Lorem ipsum dolor sit amet. Hic dolor reiciendis rem earum voluptatem sit similique magnam est repellat mollitia."}</p>
                                    <img src="/assets/icons/quotes-1.svg" className="icon" />
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <button className="show-more">Ver mais</button>
        </div>
    );
}
