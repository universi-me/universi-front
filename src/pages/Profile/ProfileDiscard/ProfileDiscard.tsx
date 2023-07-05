import './ProfileDiscard.css'

export type ProfileDiscardChangesProps = {
    onDiscard: () => any;
    onCancel:  () => any;
};

export function ProfileDiscardChanges(props: ProfileDiscardChangesProps) {
    return (
        <div id="discard-changes">
            <h2>Tem certeza que deseja cancelar suas alterações?</h2>
            <p>Essa ação não poderá ser desfeita e você perderá suas alterações.</p>
            <div className="buttons">
                <button className="discard-button" onClick={props.onDiscard}>Descartar</button>
                <button className="cancel-button" onClick={props.onCancel}>Cancelar</button>
            </div>
        </div>
    );
}
