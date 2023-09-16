import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UniversimeApi from '@/services/UniversimeApi';
import './Category.css';
import VideoStar from './Components/Video/VideoStar';
import NotFoundVideo from './Components/NotFoundVideo/NotFoundVideo';
import Footer from '@/components/Footer/Footer';
import StarRating from './Components/StarRating/StarRating';
import { Category } from '@/types/Capacity';
import { Video } from '@/types/Capacity';

const CategoryPage: React.FC = () => {
  const { category: categoryId } = useParams<{ category: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<Category|null>(null);

  useEffect(() => {
    const fetchVideosByCategory = async () => {
      try {
        if (categoryId === undefined)
          throw new Error("Categoria não informada");

        const response = await UniversimeApi.Capacity.videosInCategory({id: categoryId});
        setVideos(response.body?.videos ?? []);
        if (!response.body?.videos.length) {
          setHasError(true);
        }

        UniversimeApi.Capacity.getCategory({id: categoryId})
          .then(res => setCategoryData(res.body?.category ?? null));

      } catch (error) {
        console.error('Erro ao buscar os vídeos:', error);
      }
    };
    fetchVideosByCategory();
  }, [categoryId]);

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

    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(updateThumbnailImage);
  }, [videos]);

  return (
    <div className="category-tela">
      <div id="category">
        <h1 id="title-category">Capacitação em {categoryData?.name ?? ""}</h1>
        <VideoStar />
        <div id="conteudo-category">
          <h1 id="subtitle-category">Todos os vídeos de {categoryData?.name ?? ""}</h1>
          <div className="video-list-all">
            {
            videos.length === 0 ? <p className="empty">Nenhum vídeo nessa categoria</p> :

            videos.map((video) => (
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
