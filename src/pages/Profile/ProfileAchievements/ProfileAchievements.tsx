import { useContext } from "react";
import { Link } from "react-router-dom";
import { ProfileContext } from "@/pages/Profile";

export function ProfileAchievements() {
    const profileContext = useContext(ProfileContext);
    if (profileContext === null || profileContext.profileListData.achievements.length == 0)
        return null;

    const achievementsCount = profileContext.profileListData.achievements.length.toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    return (
        <div className="achievements card">
            <div className="section">

                <div className="counter-wrapper">
                    <h2 className="card-heading">Conquistas</h2>
                    <h2 className="card-heading counter">{achievementsCount}</h2>
                </div>

                <div className="items-wrapper">
                    <div className="show-items">
                        {
                            // todo: achievements from API
                            profileContext.profileListData.achievements.map((achievement) => {
                                return (
                                    <Link to={""} className="achievement item" key={achievement.id} title={achievement.title}>
                                        {/* todo: set achievement url */}
                                        <img src={achievement.icon} alt="" />
                                    </Link>
                                );
                            })
                        }
                    </div>

                    {/* todo: All achievements page */}
                    <Link to={""} className="show-all-items">Ver todas as conquistas</Link>
                </div>
            </div>
        </div>
    );
}