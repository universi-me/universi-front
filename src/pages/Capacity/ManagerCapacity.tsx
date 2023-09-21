import React, { useState, useEffect, useContext } from 'react';
import Select, { MultiValue } from 'react-select';

import UniversimeApi from '@/services/UniversimeApi';
import { Folder, Video , Category, Types} from '@/types/Capacity';
import { AuthContext } from '@/contexts/Auth';
import * as SwalUtils from "@/utils/sweetalertUtils";

import './ManagerCapacity.css'

const CrudTela: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const contentTypes = Types;
  

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedVideo, setEditedVideo] = useState<Video | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedUrl, setEditedUrl] = useState('');
  const [editedRating, setEditedRating] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newRating, setNewRating] = useState(1);
  const [newType, setNewType] = useState<string>(contentTypes[0])

  const [categories, setCategories] = useState<any>([]);
  const [playlists, setPlaylists] = useState<any>([]);
  const [types, setTypes] = useState<any>([]);
  
  const [categoriesToRemoveIds, setCategoriesToRemoveIds] = useState<string[]>([]);
  const [categoriesToAddIds, setCategoriesToAddIds] = useState<string[]>([]);
  const [categoriesToRemove, setCategoriesToRemove] = useState<any>([]);
  const [categoriesStateSelected, setCategoriesStateSelected] = useState<any>([]);

  const [playlistsToRemoveIds, setPlaylistsToRemoveIds] = useState<string[]>([]);
  const [playlistsToAddIds, setPlaylistsToAddIds] = useState<string[]>([]);
  const [playlistsToRemove, setPlaylistsToRemove] = useState<any>([]);
  const [playlistsStateSelected, setPlaylistsStateSelected] = useState<any>([]);

  useEffect(() => { 
    fetchVideos();
    fetchCategories();
    fetchPlaylists();
    }, []);

  const fetchVideos = async () => {
    try {
      const response = await UniversimeApi.Capacity.videoList();
      setVideos(response.body.videos);
    } catch (error) {
      console.error('Erro ao buscar os vídeos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const arr: { value: string; label: string; }[] = [];
      const response = await UniversimeApi.Capacity.categoryList();
      let categoriesArr = response.body.categories;
      categoriesArr.map((category: Category) => {
        return arr.push({value: category.id, label: category.name});
      });
      setCategories(arr)
    } catch (error) {
      console.error('Erro ao obter categorias:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const arr: { value: string; label: string; }[] = [];
      const response = await UniversimeApi.Capacity.playlistList()
      let playlistsArr = response.body.playlists;
      playlistsArr.map((playlist: Folder) => {
        return arr.push({value: playlist.id, label: playlist.name});
      });
      setPlaylists(arr)
    } catch (error) {
      console.error('Erro ao obter playlists:', error);
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

      await UniversimeApi.Capacity.removeVideo({id: selectedVideo.id})
        .then(res => {
            if (!res.success)
                throw new Error(res.message);
        })
        .catch((reason: Error) => {
            SwalUtils.fireModal({
                title: "Erro ao deletar vídeo",
                text: reason.message,
                icon: "error",
            });
        });

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
    
    const videoCategoriesIds = video.categories;
    const arrCategories: { value: string; label: string; }[] = [];
    videoCategoriesIds?.forEach(function (category: Category) {
      return arrCategories.push({value: category.id, label: category.name});
    });
    setCategoriesStateSelected(arrCategories);

    const videoPlaylistsIds = video.playlists;
    const arrPlaylists: { value: string; label: string; }[] = [];
    videoPlaylistsIds?.forEach(function (playlist: Folder) {
      return arrPlaylists.push({value: playlist.id, label: playlist.name});
    });
    setPlaylistsStateSelected(arrPlaylists);

    
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

        addCategoriesByIds: categoriesToAddIds,
        removeCategoriesByIds: categoriesToRemoveIds,
        addPlaylistsByIds: playlistsToAddIds,
        removePlaylistsByIds: playlistsToRemoveIds,
      }).then(res => {
        if (!res.success)
          throw new Error(res.message);
      });

      fetchVideos();
    } catch (error: any) {
      SwalUtils.fireModal({
        title: "Erro ao editar vídeo",
        text: 'message' in error ? error.message : '',
        icon: 'error',
      });
    }

    setShowEditModal(false);
    setIsEditing(false);
    setEditedVideo(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedUrl('');
    setEditedRating(1);

    cleanCategoriesAndPlaylists()
  };

  const cleanCategoriesAndPlaylists = () => {
    setCategoriesToRemoveIds([]);
    setCategoriesToRemove([]);
    setCategoriesToAddIds([]);
    setCategoriesStateSelected([]);

    setPlaylistsToRemoveIds([]);
    setPlaylistsToAddIds([]);
    setPlaylistsToRemove([]);
    setPlaylistsStateSelected([]);
  };

  const handleAddVideo = async () => {
    try {
      await UniversimeApi.Capacity.createVideo({
        title: newTitle,
        description: newDescription,
        url: newUrl,
        rating: newRating,
        type: newType,
        addCategoriesByIds: categoriesToAddIds,
        addPlaylistsByIds: playlistsToAddIds,
      }).then(res => {
        if (!res.success)
            throw new Error(res.message);
      });

    } catch (error: any) {
        SwalUtils.fireModal({
            title: "Erro ao criar vídeo",
            text: 'message' in error ? error.message : '',
            icon: "error",
        });
    }

    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
    setNewRating(1);

    cleanCategoriesAndPlaylists()
    fetchVideos();
  };

  const handleCreateVideo = async () => {
    setShowAddModal(true);

    cleanCategoriesAndPlaylists()

  };

  const handleCategoriesOnChange = (value: any) => {
    let difference = categoriesStateSelected.filter((x: any) => !value.includes(x))
    setCategoriesStateSelected(value)
    let categoriesToRem = categoriesToRemove
    categoriesToRem = [...categoriesToRem, ...difference]
    categoriesToRem = categoriesToRem.reduce(function (acc: any, curr: any) {
      if (!acc.includes(curr) && !value.includes(curr))
          acc.push(curr);
          return acc;
    }, []);
    setCategoriesToRemove(categoriesToRem)
    
    const categoriesRemoveArr: string[] = [];
    categoriesToRem.map((category: any) => {
      return categoriesRemoveArr.push(category.value);
    });
    setCategoriesToRemoveIds(categoriesRemoveArr)
    
    const categoriesAddArr: string[] = [];
    value.map((category: any) => {
      return categoriesAddArr.push(category.value);
    });
    setCategoriesToAddIds(categoriesAddArr)
  };

  const handlePlaylistsOnChange = (value: any) => {
    let difference = playlistsStateSelected.filter((x: any) => !value.includes(x))
    setPlaylistsStateSelected(value)

    let playlistsToRem = playlistsToRemove
    playlistsToRem = [...playlistsToRem, ...difference]
    playlistsToRem = playlistsToRem.reduce(function (acc: any, curr: any) {
      if (!acc.includes(curr) && !value.includes(curr))
          acc.push(curr);
          return acc;
    }, []);
    setPlaylistsToRemove(playlistsToRem)

    const playlistsRemoveArr: string[] = [];
    playlistsToRem.map((playlist: any) => {
      return playlistsRemoveArr.push(playlist.value);
    });
    setPlaylistsToRemoveIds(playlistsRemoveArr)
    
    const playlistsAddArr: string[] = [];
    value.map((playlist: any) => {
      return playlistsAddArr.push(playlist.value);
    });
    setPlaylistsToAddIds(playlistsAddArr)
  };


  const handleTypeOnChange = (value: any) => {
    setNewType(value.value)
  }

  const auth = useContext(AuthContext);

  return (
    !auth.user ? null :
    <div>
        <h1 className="title-page">Gerenciador de Vídeos</h1>
        <button className='button-adicionar' type="button" onClick={() => handleCreateVideo()}>Adicionar Vídeo</button>
            <table className="videos-table">
                <thead>
                     <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>URL</th>
                        <th>Classificação</th>
                        <th>Categorias</th>
                        <th>Tipo</th>
                        <th>Playlists</th>
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
                        <td>{video.categories?.map(function(elem){ return elem.name; }).join(", ")}</td>
                        <td>{video.type}</td>
                        <td>{video.playlists?.map(function(elem){ return elem.name; }).join(", ")}</td>
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
            <div className="space-text">
              <label>Rating:</label>
              <div className="rating-star-container">
                {[1, 2, 3, 4, 5].map(rating => {
                    return (
                        <button type="button" className="star-button" value={rating}
                            onClick={e => setEditedRating(Number(e.currentTarget.value))}
                        >
                            <span className={`bi bi-star${rating <= editedRating ? "-fill" : ""}`} />
                        </button>
                    )
                })}
              </div>
            </div>
            <div style={{marginTop: '15px'}}>
              <label >Categorias:</label>
              <Select placeholder= "Selecionar Categorias..."  isMulti name="categories" options={categories} className="basic-multi-select" theme={(theme) => ({
                ...theme,
                borderRadius: 10,
                color: 'black',
                colors: {
                  ...theme.colors,
                  primary25: 'red',
                  primary: 'blue',
                  neutral10: 'green',
                  neutral5:  'black',
                  neutral0: '#c2c2c2'
                },
              })}
              onChange={handleCategoriesOnChange} value={categoriesStateSelected} classNamePrefix="select" noOptionsMessage={()=>"Categoria Não Encontrada"} />
            </div>
            <div style={{marginTop: '15px'}}>
              <label>Playlists:</label>
              <Select placeholder= "Selecionar Playlists..."  isMulti name="playlists" options={playlists} className="basic-multi-select" theme={(theme) => ({
                ...theme,
                borderRadius: 10,
                color: 'black',
                colors: {
                  ...theme.colors,
                  primary25: 'red',
                  primary: 'blue',
                  neutral10: 'green',
                  neutral5:  'black',
                  neutral0: '#c2c2c2'
                },
              })}
              onChange={handlePlaylistsOnChange} value={playlistsStateSelected} classNamePrefix="select" noOptionsMessage={()=>"Playlist Não Encontrada"} />
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
            <div className="space-text">
              <label>Rating:</label>
              <div className="rating-star-container">
                {
                    [1, 2, 3, 4, 5].map(rating => {
                        return (
                            <button key={rating} type="button" className="star-button" value={rating}
                                onClick={e => setNewRating(Number(e.currentTarget.value))}
                            >
                                <span className={`bi bi-star${rating <= newRating ? "-fill" : ""}`} />
                            </button>
                        )
                    })
                }
              </div>
            </div>
             <div style={{marginTop: '15px'}}>
              <label >Tipo:</label>
              <Select placeholder= "Selecionar Tipo..." name="tipos" options={contentTypes.map((label) => ({value: label, label: label}))} className="basic-multi-select" theme={(theme) => ({
                ...theme,
                borderRadius: 10,
                color: 'black',
                colors: {
                  ...theme.colors,
                  primary25: 'red',
                  primary: 'blue',
                  neutral10: 'green',
                  neutral5:  'black',
                  neutral0: '#c2c2c2'
                },
              })}
              onChange={handleTypeOnChange} value={{value: newType, label: newType}} classNamePrefix="select" noOptionsMessage={()=>"Tipo Não Encontrado"} />
              
            </div>
            <div style={{marginTop: '15px'}}>
              <label >Categorias:</label>
              <Select placeholder= "Selecionar Categorias..."  isMulti name="categories" options={categories} className="basic-multi-select" theme={(theme) => ({
                ...theme,
                borderRadius: 10,
                color: 'black',
                colors: {
                  ...theme.colors,
                  primary25: 'red',
                  primary: 'blue',
                  neutral10: 'green',
                  neutral5:  'black',
                  neutral0: '#c2c2c2'
                },
              })}
              onChange={handleCategoriesOnChange} value={categoriesStateSelected} classNamePrefix="select" noOptionsMessage={()=>"Categoria Não Encontrada"} />
            </div>
            <div style={{ marginTop: '15px' }}>
              <label>Playlists:</label>
              <Select placeholder= "Selecionar Playlists..."  isMulti name="playlists" options={playlists} className="basic-multi-select" theme={(theme) => ({
                ...theme,
                borderRadius: 10,
                color: 'black',
                colors: {
                  ...theme.colors,
                  primary25: 'red',
                  primary: 'blue',
                  neutral10: 'green',
                  neutral5:  'black',
                  neutral0: '#c2c2c2'
                },
              })}
              onChange={handlePlaylistsOnChange} value={playlistsStateSelected} classNamePrefix="select" noOptionsMessage={()=>"Playlist Não Encontrada"} />
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
