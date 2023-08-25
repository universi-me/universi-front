import React, { useState, useEffect, useContext } from 'react';
import UniversimeApi from '@/services/UniversimeApi';
import { Video } from '@/types/Capacity';
import './ManagerCapacity.css'
import { AuthContext } from '@/contexts/Auth';

const CrudTela: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedVideo, setEditedVideo] = useState<Video | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedUrl, setEditedUrl] = useState('');
  const [editedRating, setEditedRating] = useState(1);
  const [editedCategory, setEditedCategory] = useState('');
  const [editedPlaylist, setEditedPlaylist] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newRating, setNewRating] = useState(1);
  const [newCategory, setNewCategory] = useState('');
  const [newPlaylist, setNewPlaylist] = useState('');


  useEffect(() => { 
    fetchVideos();
    }, []);

  const fetchVideos = async () => {
    try {
      const response = await UniversimeApi.Capacity.videoList();
      setVideos(response.body.videos);
    } catch (error) {
      console.error('Erro ao buscar os vídeos:', error);
    }
  };

  const handleDeleteClick = (video: Video) => {
    setSelectedVideo(video);
    setShowConfirmation(true);
  };

  const handleDeleteVideo = async () => {
    try {
      if (selectedVideo === null)
        throw new Error("Nenhum vídeo selecionado");

      await UniversimeApi.Capacity.removeVideo({id: selectedVideo.id});
      setShowConfirmation(false);
      setSelectedVideo(null);
      fetchVideos();
    } catch (error) {
      console.error('Erro ao deletar vídeo:', error);
    }
  };

  const handleEditClick = (video: Video) => {
    setEditedVideo(video);
    setEditedTitle(video.title);
    setEditedDescription(video.description ?? "");
    setEditedUrl(video.url);
    setEditedRating(video.rating);
    setEditedCategory(video.category?.id ?? "");
    setEditedPlaylist("");
    setShowEditModal(true);
    setIsEditing(true);
  };

  const handleEditVideo = async () => {
    try {
      if (editedVideo === null)
        throw new Error("Nenhum vídeo selecionado");

    await UniversimeApi.Capacity.editVideo({
        id: editedVideo.id,

        title: editedTitle,
        description: editedDescription,
        url: editedUrl,
        rating: editedRating,
        category: editedCategory,
        playlist: editedPlaylist,
      });

      setShowEditModal(false);
      setIsEditing(false);
      setEditedVideo(null);
      setEditedTitle('');
      setEditedDescription('');
      setEditedUrl('');
      setEditedRating(1);
      setEditedCategory('');
      setEditedPlaylist('');
      fetchVideos();
    } catch (error) {
      console.error('Erro ao editar vídeo:', error);
    }
  };

  const handleAddVideo = async () => {
    try {
      await UniversimeApi.Capacity.createVideo({
        title: newTitle,
        description: newDescription,
        url: newUrl,
        rating: newRating,
        category: newCategory,
      });

      setShowAddModal(false);
      setNewTitle('');
      setNewDescription('');
      setNewUrl('');
      setNewRating(1);
      setNewCategory('');
      setNewPlaylist('');
      fetchVideos();
    } catch (error) {
      console.error('Erro ao adicionar vídeo:', error);
    }
  };

  const auth = useContext(AuthContext);

  return (
    !auth.user ? null :
    <div>
        <h1 className="title-page">Gerenciador de Vídeos</h1>
        <button className='button-adicionar' type="button" onClick={() => setShowAddModal(true)}>Adicionar Vídeo</button>
            <table className="videos-table">
                <thead>
                     <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>URL</th>
                        <th>Classificação</th>
                        <th>Categoria</th>
                        <th>Playlist</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map((video) => (
                        <tr key={video.id}>
                        <td>{video.id}</td>
                        <td>{video.title}</td>
                        <td>{video.url}</td>
                        <td>{video.rating}</td>
                        <td>{video.category?.name}</td>
                        <td>{"video.playlist"}</td>
                        <td>
                            <button className='button-edit' onClick={() => handleEditClick(video)}>Editar</button>
                            <button className='button-delete' type="button" onClick={() => handleDeleteClick(video)}>Deletar</button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showConfirmation && (
            <div className="confirmation-container">
                <div className="confirmation-box-delete">
                    <h2 className="titulo-box">Confirmar exclusão</h2>
                    <p>Deseja deletar o vídeo "{selectedVideo?.title}" ?</p>
                    <div className="confirmation-buttons">
                    <button className="button-boxCancel" onClick={() => setShowConfirmation(false)}>Cancelar</button>
                    <button className="button-boxDelete" onClick={handleDeleteVideo}>Deletar</button>
                    </div>
                </div>
            </div>
            )}
            {showEditModal && (
        <div className="confirmation-container">
          <div className="confirmation-box-edit">
            <h2 className="titulo-box">Editar vídeo</h2>
            <div className="space-text">
              <label>Título:</label>
              <input className='input-text' style={{width: '300px'}} type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
            </div>
            <div className="space-text">
              <label>Descrição:</label>
              <textarea className='input-text' style={{width: '263px', resize: "vertical"}} rows={5} value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
            </div>
            <div className="space-text">
              <label>URL:</label>
              <input className='input-text' style={{width: '315px'}} type="text" value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} />
            </div>
            <div  style={{display: 'flex', justifyContent: 'center'}}>
              <label >Categoria:</label>
              <input  className='input-text' style={{width: '120px', marginRight: '42px'}} type="text" value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)} />
              <label>Rating:</label>
              <select style={{marginLeft: '8px'}} value={editedRating} onChange={(e) => setEditedRating(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div style={{marginTop: '15px'}}>
              <label>Playlist:</label>
              <input className='input-text' style={{width: '285px'}} type="text" value={editedPlaylist} onChange={(e) => setEditedPlaylist(e.target.value)} />
            </div>
            <div style={{marginTop: '35px'}} className="confirmation-buttons">
              <button className='button-boxCancel' onClick={() => setShowEditModal(false)}>Cancelar</button>
              <button className='button-boxSalve' onClick={handleEditVideo}>Salvar</button>
            </div>
          </div>
        </div>
      )} 
      {showAddModal && (
        <div className="confirmation-container">
          <div className="confirmation-box-edit">
            <h2 className="titulo-box">Adicionar vídeo</h2>
            <div className="space-text">
              <label>Título:</label>
              <input className='input-text' style={{ width: '300px'}} type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </div>
            <div className="space-text">
              <label>Descrição:</label>
              <textarea className='input-text' style={{ width: '263px', resize: "vertical"}} rows={5} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </div>
            <div className="space-text">
              <label>URL:</label>
              <input className='input-text' style={{ width: '315px'}} type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <label >Categoria:</label>
              <input className='input-text' style={{width: '120px', marginRight: '42px'}} type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
              <label>Rating:</label>
              <select style={{ marginLeft: '8px' }} value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label>Playlist:</label>
              <input className='input-text' style={{width: '285px'}} type="text" value={newPlaylist} onChange={(e) => setNewPlaylist(e.target.value)} />
            </div>
            <div style={{ marginTop: '35px' }} className="confirmation-buttons">
              <button className='button-boxCancel' onClick={() => setShowAddModal(false)}>Cancelar</button>
              <button className='button-boxSalve' onClick={handleAddVideo}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
};

export default CrudTela;
