import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UniversimeApi from '@/services/UniversimeApi';
import '../../Category.css';
import './VideoStar.css';
import StarRating from '../StarRating/StarRating';
import { Video } from "@/types/Capacity"

const VideoStar: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideosByCategory = async () => {
      try {
        if (category === undefined)
          throw new Error("Categoria não informada");

        const response = await UniversimeApi.Capacity.videosInCategory({id: category});
        setVideos(response.body.videos);
      } catch (error) {
        console.error('Erro ao buscar os vídeos:', error);
      }
    };
    fetchVideosByCategory();
  }, [category]);

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

  const filterTopVideos = (videos: Video[]): Video[] => {
    const topRatedVideos = videos.filter((video) => video.rating === 5);
    return topRatedVideos.length > 10
      ? shuffleArray(topRatedVideos).slice(0, 10)
      : topRatedVideos;
  };

  //Algoritmo Fisher-Yates (Ele embaralha um array de itens)
  const shuffleArray = <T extends unknown>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const topRatedVideos = filterTopVideos(videos);
  return (
    <div id="conteudo-destaque">
        <h2 id="subtitle-category">Videos em Destaque</h2>
        <div className="video-top">
          {topRatedVideos.map((video) => (
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
  );
};

export default VideoStar;
