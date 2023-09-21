import UniversimeApi from "@/services/UniversimeApi";
import { Folder } from "@/types/Capacity";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./PlaylistBar.css";

export default function AllFolders() {
    const [availableFolders, setAvailableFolders] = useState<Folder[]>([]);

    useEffect(() => {
        UniversimeApi.Capacity.folderList()
            .then(res => setAvailableFolders(res.body.playlists));
    }, []);

    return (
        <div>
            <h1 id="title" style={{ marginBottom: '20px', marginTop: '35px' }}>Pastas disponíveis</h1>
            <div className="folder-bar">
                {
                    availableFolders.length === 0
                        ? <div className="empty-list">Nenhuma pasta cadastrada.</div>
                        : availableFolders.map(p =>
                        <div className="folder-container" key={p.id}>
                            <Link to={`/capacitacao/playlist/${p.id}`} className="folder-card">
                                <img src={p.image ?? ""} alt="Logo da pasta de capacitação" />
                                <span className="folder-title">{p.name}</span>
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
