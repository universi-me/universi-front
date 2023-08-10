import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Playlist.css';
import NotFoundVideo from './Components/NotFoundVideo/NotFoundVideo';
import InfoButton from './Components/InfoButton/InfoButton';
import Footer from '@/components/Footer/Footer';
import StarRating from './Components/StarRating/StarRating';

interface Video {
  id: number;
  title: string;
  url: string;
  rating: number;
  playlist: string;
}

const PlaylistPage: React.FC = () => {
  const { playlist } = useParams<{ playlist: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const fetchVideosByPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/capacitacao/playlist/${playlist}`);
        setVideos(response.data);
        if (response.data.length === 0) {
          setHasError(true);
        }
      } catch (error) {
        console.error('Erro ao buscar os vídeos:', error);
      }
    };
    fetchVideosByPlaylist();
  }, [playlist]);

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
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        thumbnail.querySelector('img').setAttribute('src', thumbnailUrl);
      }
    };

    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(updateThumbnailImage);
  }, [videos]);

  if (hasError) {
    return <NotFoundVideo />;
  }

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
              <h2 className="title-playlist">{formatPlaylistName(playlist)}</h2>
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
          <div className="video-list-all">
            {videos.map((video) => (
              <div key={video.id} className="video-item">
                <div className="video-thumbnail">
                  <Link to={`/capacitacao/play/${video.id}`}>
                    <img
                      className="video-image"
                      src={video.url}
                      alt="Thumbnail do vídeo"
                    />
                  </Link>
                </div>
                <div>
                  <h3 className="video-title">
                    {video.title.length > 48
                      ? `${video.title.substring(0, 48)}...`
                      : video.title}
                  </h3>
                </div>
                <div className="video-rating">
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