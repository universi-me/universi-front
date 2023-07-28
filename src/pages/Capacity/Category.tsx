import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Category.css';
import VideoStar from './Components/Video/VideoStar';
import NotFoundVideo from './Components/NotFoundVideo/NotFoundVideo';
import Footer from '@/components/Footer/Footer';
import StarRating from './Components/StarRating/StarRating';

interface Video {
  id: number;
  title: string;
  url: string;
  rating: number;
  category: string;
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const fetchVideosByCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/capacitacao/categoria/${category}`);
        setVideos(response.data);
        if (response.data.length === 0) {
          setHasError(true);
        }
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

  if (hasError) {
    return <NotFoundVideo />;
  }

  return (
    <div className="category-tela">
      <div id="category">
        <h1 id="title-category">Capacitação em {category}</h1>
        <VideoStar />
        <div id="conteudo-category">
          <h1 id="subtitle-category">Todos os vídeos de {category}</h1>
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

export default CategoryPage;
