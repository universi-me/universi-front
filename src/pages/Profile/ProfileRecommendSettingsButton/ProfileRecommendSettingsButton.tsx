import { CSSProperties } from 'react';
import './ProfileRecommendSettingsButton.css'

export type ProfileRecommendSettingsButtonProps = {
    loggedUserProfile: boolean;
};

export function ProfileRecommendSettingsButton(props: ProfileRecommendSettingsButtonProps) {
    const className = props.loggedUserProfile
        ? "settings"
        : "recommend";

    const buttonContent = props.loggedUserProfile
        ? <img src="/assets/icons/settings.svg" />
        : "Recomendar";

    const buttonHeight = props.loggedUserProfile
        ? '3.75em'
        : '2.5em';

    return (
        <button className={"recommend-settings-button " + className}
            style={{'--height': buttonHeight} as CSSProperties}>
            { buttonContent }
        </button>
    );
}
