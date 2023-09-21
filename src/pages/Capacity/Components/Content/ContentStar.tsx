import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UniversimeApi from '@/services/UniversimeApi';
import '../../Category.css';
import './ContentStar.css';
import StarRating from '../StarRating/StarRating';
import { Content } from "@/types/Capacity"

const ContentStar: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    const fetchContentsByCategory = async () => {
      try {
        if (category === undefined)
          throw new Error("Categoria não informada");

        const response = await UniversimeApi.Capacity.contentsInCategory({id: category});
        setContents(response.body.contents);
      } catch (error) {
        console.error('Erro ao buscar os vídeos:', error);
      }
    };
    fetchContentsByCategory();
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
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        thumbnail.querySelector('img').setAttribute('src', thumbnailUrl);
      }
    };

    const contentThumbnails = document.querySelectorAll('.content-thumbnail');
    contentThumbnails.forEach(updateThumbnailImage);
  }, [contents]);

  const filterTopContents = (contents: Content[]): Content[] => {
    const topRatedContents = contents.filter((content) => content.rating === 5);
    return topRatedContents.length > 10
      ? shuffleArray(topRatedContents).slice(0, 10)
      : topRatedContents;
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

  const topRatedContents = filterTopContents(contents);
  return (
    <div id="conteudo-destaque">
        <h2 id="subtitle-category">Conteúdos em Destaque</h2>
        <div className="content-top">
          {topRatedContents.map((content) => (
              <div key={content.id} className="content-item">
                  <div className="content-thumbnail">
                  <Link to={`/capacitacao/play/${content.id}`}>
                    <img
                      className="content-image"
                      src={content.url}
                      alt="Thumbnail do conteúdo"
                    />
                  </Link>
                </div>
                  <div>
                      <h3 className="content-title">
                          {content.title.length > 48
                              ? `${content.title.substring(0, 48)}...`
                              : content.title}
                      </h3>
                  </div>
                  <div className="content-rating">
                    <p className="content-rating">
                      <span className="rating-count">{content.rating.toFixed(1)}</span>
                      <span className="star-rating">
                        <StarRating rating={content.rating} />
                      </span>
                    </p>
                  </div>
              </div>
          ))}
        </div>
    </div>
  );
};

export default ContentStar;
