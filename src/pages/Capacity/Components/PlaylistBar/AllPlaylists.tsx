import UniversimeApi from "@/services/UniversimeApi";
import { Playlist } from "@/types/Capacity";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./PlaylistBar.css";

export default function AllPlaylists() {
    const [availablePlaylists, setAvailablePlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        UniversimeApi.Capacity.playlistList()
            .then(res => setAvailablePlaylists(res.body.playlists));
    }, []);

    return (
        <div>
            <h1 id="title" style={{ marginBottom: '20px', marginTop: '35px' }}>Playlists disponíveis</h1>
            <div className="playlist-bar">
                {
                    availablePlaylists.length === 0
                        ? <div className="empty-list">Nenhuma playlist cadastrada.</div>
                        : availablePlaylists.map(p =>
                        <div className="playlist-container" key={p.id}>
                            <Link to={`/capacitacao/playlist/${p.id}`} className="playlist-card">
                                <img src={p.image ?? ""} alt="Logo da playlist de capacitação" />
                                <span className="playlist-title">{p.name}</span>
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
