import { Link } from "react-router-dom";

export type ProfileAchievementsProps = {
    count: number;
    achievements: string[];
};

export function ProfileAchievements(props: ProfileAchievementsProps) {
    const achievementsCount = props.count.toLocaleString('pt-BR', {
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
                            props.achievements.map((achievement) => {
                                return (
                                    <Link to={""} className="achievement item">
                                        {/* todo: set achievement url */}
                                        {/* todo: render achievement icon */}
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