import './ProfileSkills.css'

export type ProfileSkillsProps = {
    skills: string[];
};

export function ProfileSkills(props: ProfileSkillsProps) {
    const maxSkillLevel = 3;

    return (
        <div className="skills">
            <div className="heading">Habilidades</div>
            <div className="skill-list">
                {
                    props.skills.map(skill => {
                        return (
                            <div className="skill-item">
                                {/* todo: icon from API */}
                                <img src={`/assets/icons/${"javascript"}.svg`} alt={""} className="icon" />
                                {/* todo: learning from API */}
                                <h4 className="learning">Aprendi durante a minha formação</h4>
                                <div className="skill-level-list">
                                    {
                                        Array.apply(null, Array(maxSkillLevel)).map((_, i) => {
                                            // todo: current level from API
                                            const currentLevel = 2;
                                            const learnedLevel = currentLevel >= i + 1
                                                ? 'learned'
                                                : '';

                                            return (
                                                <div className={`skill-level ${learnedLevel}`} />
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}