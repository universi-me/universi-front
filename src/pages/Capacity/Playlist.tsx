import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UniversimeApi from '@/services/UniversimeApi';
import './Playlist.css';
import NotFoundVideo from './Components/NotFoundVideo/NotFoundVideo';
import InfoButton from './Components/InfoButton/InfoButton';
import Footer from '@/components/Footer/Footer';
import StarRating from './Components/StarRating/StarRating';
import { Folder, Content } from '@/types/Capacity';

const PlaylistPage: React.FC = () => {
  const { playlist: playlistId } = useParams<{ playlist: string }>();
  const [videos, setVideos] = useState<Content[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [playlistData, setPlaylistData] = useState<Folder|null>(null);

  useEffect(() => {
    const fetchVideosByPlaylist = async () => {
      try {
        if (playlistId === undefined)
            throw new Error("Playlist não informada");

        const response = await UniversimeApi.Capacity.contentsInFolder({id: playlistId});
        setVideos(response.body?.videos ?? []);
        if (!response.body?.videos.length) {
          setHasError(true);
        }
        UniversimeApi.Capacity.getFolder({id: playlistId})
            .then(res => setPlaylistData(res.body?.playlist ?? null));

      } catch (error) {
        console.error('Erro ao buscar os vídeos:', error);
      }
    };
    fetchVideosByPlaylist();
  }, [playlistId]);

  useEffect(() => {
    const extractVideoId = (url: string) => {
      const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[1].length === 11) {
        return match[1];
      }
    };

    const updateThumbnailImage = (thumbnail: { querySelector: (arg0: string) => { (): any; new(): any; 
        getAttribute: { (arg0: string): any; new(): any; }; setAttribute: { (arg0: string, arg1: string): 
        void; new(): any; }; }; }) => {
      const videoUrl = thumbnail.querySelector('img').getAttribute('src');
      const videoId = extractVideoId(videoUrl);
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        thumbnail.querySelector('img').setAttribute('src', thumbnailUrl);
      }
    };

    const videoThumbnails = document.querySelectorAll('.content-thumbnail');
    videoThumbnails.forEach(updateThumbnailImage);
  }, [videos]);

  const formatPlaylistName = (playlist: string | undefined) => {
    if (!playlist) return '';
    const formattedName = playlist
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return formattedName;
  };

  const calculateTotalHours = () => {
    const totalHours = Math.ceil((26 * videos.length)/60);
    return totalHours;
  };

  return (
    <div className="playlist-tela">
      <div id="playlist">
        <div id="info-playlist">
            <div className="painel-info">
              <h2 className="title-playlist">{formatPlaylistName(playlistData?.name ?? "")}</h2>
              <div className="quant-videos">
                <h2 className="title-quantVideos">Tamanho:</h2>
                <h2 className="number-quantVideos">{videos.length} vídeos</h2>
              </div>
              <div className="time-videos">
                <h2 className="title-duratVideos">Duração: </h2>
                <h2 className="number-duratVideos">{calculateTotalHours()} hora(s)</h2>
                <InfoButton/>
              </div>
            </div>
        </div>
        <div id="conteudo-playlist">
          <h1 id="subtitle-playlist">Videos da Playlist:</h1>
          <div className="content-list-all">
            {
            videos.length === 0 ? <p className="empty">Nenhum vídeo nessa playlist</p> :

            videos.map((video) => (
              <div key={video.id} className="content-item">
                <div className="content-thumbnail">
                  <Link to={`/capacitacao/play/${video.id}`}>
                    <img
                      className="content-image"
                      src={video.url}
                      alt="Thumbnail do vídeo"
                    />
                  </Link>
                </div>
                <div>
                  <h3 className="content-title">
                    {video.title.length > 48
                      ? `${video.title.substring(0, 48)}...`
                      : video.title}
                  </h3>
                </div>
                <div className="content-rating">
                <p className="content-rating">
                  <span className="rating-count">{video.rating.toFixed(1)}</span>
                  <span className="star-rating">
                    <StarRating rating={video.rating} />
                  </span>
                </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PlaylistPage;
