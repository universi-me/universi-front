import './ProfileRecommendButton.css'

export type ProfileRecommendButtonProps = {
    loggedUserProfile: boolean;
};

export function ProfileRecommendButton(props: ProfileRecommendButtonProps) {
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
