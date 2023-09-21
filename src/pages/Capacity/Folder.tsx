import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UniversimeApi from '@/services/UniversimeApi';
import './Folder.css';
import InfoButton from './Components/InfoButton/InfoButton';
import Footer from '@/components/Footer/Footer';
import StarRating from './Components/StarRating/StarRating';
import { Folder, Content } from '@/types/Capacity';

const FolderPage: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const [contents, setContents] = useState<Content[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [folderData, setFolderData] = useState<Folder|null>(null);

  useEffect(() => {
    const fetchContentsByFolder = async () => {
      try {
        if (folderId === undefined)
            throw new Error("Pasta não informada");

        const response = await UniversimeApi.Capacity.contentsInFolder({id: folderId});
        setContents(response.body?.contents ?? []);
        if (!response.body?.contents.length) {
          setHasError(true);
        }
        UniversimeApi.Capacity.getFolder({id: folderId})
            .then(res => setFolderData(res.body?.folder ?? null));

      } catch (error) {
        console.error('Erro ao buscar os conteúdos:', error);
      }
    };
    fetchContentsByFolder();
  }, [folderId]);

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

  const formatFolderName = (folder: string | undefined) => {
    if (!folder) return '';
    const formattedName = folder
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return formattedName;
  };

  const calculateTotalHours = () => {
    const totalHours = Math.ceil((26 * contents.length)/60);
    return totalHours;
  };

  return (
    <div className="folder-tela">
      <div id="folder">
        <div id="info-folder">
            <div className="painel-info">
              <h2 className="title-folder">{formatFolderName(folderData?.name ?? "")}</h2>
              <div className="quant-content">
                <h2 className="title-quantContent">Tamanho:</h2>
                <h2 className="number-quantContent">{contents.length} conteúdos</h2>
              </div>
              <div className="time-content">
                <h2 className="title-duratContent">Duração: </h2>
                <h2 className="number-duratContent">{calculateTotalHours()} hora(s)</h2>
                <InfoButton/>
              </div>
            </div>
        </div>
        <div id="conteudo-folder">
          <h1 id="subtitle-folder">Conteúdos da Pasta:</h1>
          <div className="content-list-all">
            {
            contents.length === 0 ? <p className="empty">Nenhum conteúdo nessa pasta</p> :

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

export default FolderPage;
