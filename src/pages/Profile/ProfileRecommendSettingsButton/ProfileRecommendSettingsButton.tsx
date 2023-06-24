import './ProfileRecommendSettingsButton.css'

export type ProfileRecommendSettingsButtonProps = {
    loggedUserProfile: boolean;
};

export function ProfileRecommendSettingsButton(props: ProfileRecommendSettingsButtonProps) {
    const className = props.loggedUserProfile
        ? "settings"
        : "recommend";

    const buttonContent = props.loggedUserProfile
        ? <img src="/icons/settings.svg" />
        : "Recomendar";

    return (
        <button className={"recommend-settings-button " + className}>
            { buttonContent }
        </button>
    );
}
