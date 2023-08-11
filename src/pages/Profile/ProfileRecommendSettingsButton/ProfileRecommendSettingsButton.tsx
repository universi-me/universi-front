import { CSSProperties, useContext } from 'react';
import { ProfileContext } from '@/pages/Profile';

import './ProfileRecommendSettingsButton.css'

export function ProfileRecommendSettingsButton() {
    const profileContext = useContext(ProfileContext);
    if (profileContext === null)
        return null;

    const className = profileContext.accessingLoggedUser
        ? "settings"
        : "recommend";

    const buttonContent = profileContext.accessingLoggedUser
        ? <img src="/assets/icons/settings.svg" />
        : "Recomendar";

    const buttonHeight = profileContext.accessingLoggedUser
        ? '3.75em'
        : '2.5em';

    // todo: remove this once the configure button does something
    return  <div style={{height: "3.75rem"}}/>;

    return (
        <button className={"recommend-settings-button " + className}
            style={{'--height': buttonHeight} as CSSProperties}>
            { buttonContent }
        </button>
    );
}
