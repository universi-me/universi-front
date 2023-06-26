import './ProfileSettings.css'

export function ProfileSettings() {
    return (
        <div id="profile-settings">
            <form action="" className="settings-form">
                <div className="section">
                    <label htmlFor="name">Nome</label>
                    <input id="name" type="text" />
                </div>
                <div className="section">
                    <label htmlFor="biography">Biografia</label>
                    <textarea name="biography" id="biography"></textarea>
                </div>
            </form>
        </div>
    );
}