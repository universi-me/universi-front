import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import UniversimeApi from '@/services/UniversimeApi';
import './VideoPlayer.css'
import Footer from '@/components/Footer/Footer';
import StarRating from './Components/StarRating/StarRating';
import VideoAnimationPlayer from './Components/Animation/VideoAnimationPlayer';
import { Content } from '@/types/Capacity';

const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<Content | null>(null);
  const [isYouTubeIframeAPIReady, setYouTubeIframeAPIReady] = useState(false);
  const [isPlayerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        if (videoId === undefined)
            throw new Error("ID do vídeo não foi informado");

        const response = await UniversimeApi.Capacity.getContent({id: videoId});
        setVideo(response.body.video);
      } catch (error) {
        console.error('Erro ao buscar o vídeo:', error);
      }
    };
    fetchVideoData();
  }, [videoId]);

  const getVideoId = (url: string) => {
    const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  useEffect(() => {
    if(!window.YT) { // only add the script if it doesn't exist
      const loadYouTubeScript = () => {
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(scriptTag);
      };

      (window as any).onYouTubeIframeAPIReady = () => {
        setYouTubeIframeAPIReady(true);
      };

      loadYouTubeScript();
    }
  }, []);

  useEffect(() => {
    if(window.YT) {
      (window.YT as any).ready(function() {
        setPlayerReady(true);
      });
    }
  }, [isYouTubeIframeAPIReady]);

  const loadVideo = () => {
    if(isPlayerReady && video && video.url && playerRef) {
      playerRef.current = new window.YT.Player('player', {
        height: '500',
        width: '1000',
        videoId: getVideoId(video.url),
      });
    }
  };

  useEffect(() => {
    loadVideo();
  }, [isPlayerReady, video]);

  return (
    <div>
      {video ? (
        <>
            <div id="conteudo-video">
                <div id="player" className="youtube-video"></div>
                <VideoAnimationPlayer/>
                <p className="error-video">Atenção: Caso demore para iniciar o vídeo reinicie a página</p>
            </div>
            <div id="information-video">
                <div className="details-video">
                    <div className="box-title">
                        <h2 className="panel-title">{video.title}</h2>
                    </div>
                    <div className="box-rating">
                      <p className="content-rating">
                        <span className="rating-count">{video.rating.toFixed(1)}</span>
                        <span className="star-rating">
                          <StarRating rating={video.rating} />
                        </span>
                      </p>
                    </div>
                </div>
                <p className="panel-description">{video.description}</p>
                <Footer/>
            </div>
        </>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default VideoPage;
