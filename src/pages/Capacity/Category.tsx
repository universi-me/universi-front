import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UniversimeApi from '@/services/UniversimeApi';
import './Category.css';
import ContentStar from './Components/Content/ContentStar';
import Footer from '@/components/Footer/Footer';
import StarRating from './Components/StarRating/StarRating';
import { Category, Content } from '@/types/Capacity';

const CategoryPage: React.FC = () => {
  const { category: categoryId } = useParams<{ category: string }>();
  const [contents, setContents] = useState<Content[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<Category|null>(null);

  useEffect(() => {
    const fetchContentsByCategory = async () => {
      try {
        if (categoryId === undefined)
          throw new Error("Categoria não informada");

        const response = await UniversimeApi.Capacity.contentsInCategory({id: categoryId});
        setContents(response.body?.videos ?? []);
        if (!response.body?.videos.length) {
          setHasError(true);
        }

        UniversimeApi.Capacity.getCategory({id: categoryId})
          .then(res => setCategoryData(res.body?.category ?? null));

      } catch (error) {
        console.error('Erro ao buscar os vídeos:', error);
      }
    };
    fetchContentsByCategory();
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

    const contentThumbnails = document.querySelectorAll('.content-thumbnail');
    contentThumbnails.forEach(updateThumbnailImage);
  }, [contents]);

  return (
    <div className="category-tela">
      <div id="category">
        <h1 id="title-category">Capacitação em {categoryData?.name ?? ""}</h1>
        <ContentStar />
        <div id="conteudo-category">
          <h1 id="subtitle-category">Todos os conteúdos de {categoryData?.name ?? ""}</h1>
          <div className="content-list-all">
            {
            contents.length === 0 ? <p className="empty">Nenhum conteúdo nessa categoria</p> :

            contents.map((content) => (
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
      </div>
      <Footer/>
    </div>
  );
};

export default CategoryPage;
