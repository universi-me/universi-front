import React, { useState, useEffect, useContext } from 'react';
import Select, { MultiValue } from 'react-select';

import UniversimeApi from '@/services/UniversimeApi';
import { Folder, Content , Category, Types} from '@/types/Capacity';
import { AuthContext } from '@/contexts/Auth';
import * as SwalUtils from "@/utils/sweetalertUtils";

import './ManagerCapacity.css'

const CrudTela: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const contentTypes = Types;
  

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState<Content | null>(null);
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
  const [folders, setFolders] = useState<any>([]);
  const [types, setTypes] = useState<any>([]);
  
  const [categoriesToRemoveIds, setCategoriesToRemoveIds] = useState<string[]>([]);
  const [categoriesToAddIds, setCategoriesToAddIds] = useState<string[]>([]);
  const [categoriesToRemove, setCategoriesToRemove] = useState<any>([]);
  const [categoriesStateSelected, setCategoriesStateSelected] = useState<any>([]);

  const [foldersToRemoveIds, setFoldersToRemoveIds] = useState<string[]>([]);
  const [foldersToAddIds, setFoldersToAddIds] = useState<string[]>([]);
  const [foldersToRemove, setFoldersToRemove] = useState<any>([]);
  const [foldersStateSelected, setFoldersStateSelected] = useState<any>([]);

  useEffect(() => { 
    fetchContents();
    fetchCategories();
    fetchFolders();
    }, []);

  const fetchContents = async () => {
    try {
      const response = await UniversimeApi.Capacity.contentList();
      setContents(response.body?.contents ?? []);
    } catch (error) {
      console.error('Erro ao buscar os conteúdos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const arr: { value: string; label: string; }[] = [];
      const response = await UniversimeApi.Capacity.categoryList();
      let categoriesArr = response.body?.categories ?? [];
      categoriesArr.map((category: Category) => {
        return arr.push({value: category.id, label: category.name});
      });
      setCategories(arr)
    } catch (error) {
      console.error('Erro ao obter categorias:', error);
    }
  };

  const fetchFolders = async () => {
    try {
      const arr: { value: string; label: string; }[] = [];
      const response = await UniversimeApi.Capacity.folderList()
      let foldersArr = response.body?.folders ?? [];
      foldersArr.map((folder: Folder) => {
        return arr.push({value: folder.id, label: folder.name});
      });
      setFolders(arr)
    } catch (error) {
      console.error('Erro ao obter pastas:', error);
    }
  };

  const handleDeleteClick = (content: Content) => {
    setSelectedContent(content);
    setShowConfirmation(true);
  };

  const handleDeleteContent = async () => {
    try {
      if (selectedContent === null)
        throw new Error("Nenhum conteúdo selecionado");

      await UniversimeApi.Capacity.removeContent({id: selectedContent.id})

        setShowConfirmation(false);
        setSelectedContent(null);
        fetchContents();
    } catch (error) {
      console.error('Erro ao deletar conteúdo:', error);
    }
  };

  const handleEditClick = (content: Content) => {
    setEditedContent(content);
    setEditedTitle(content.title);
    setEditedDescription(content.description ?? "");
    setEditedUrl(content.url);
    setEditedRating(content.rating);
    
    const contentCategoriesIds = content.categories;
    const arrCategories: { value: string; label: string; }[] = [];
    contentCategoriesIds?.forEach(function (category: Category) {
      return arrCategories.push({value: category.id, label: category.name});
    });
    setCategoriesStateSelected(arrCategories);

    const contentFoldersIds = content.folders;
    const arrFolders: { value: string; label: string; }[] = [];
    contentFoldersIds?.forEach(function (folder: Folder) {
      return arrFolders.push({value: folder.id, label: folder.name});
    });
    setFoldersStateSelected(arrFolders);

    
    setShowEditModal(true);
    setIsEditing(true);
  };

  const handleEditContent = async () => {
    try {
      if (editedContent === null)
        throw new Error("Nenhum conteúdo selecionado");

    await UniversimeApi.Capacity.editContent({
        id: editedContent.id,

        title: editedTitle,
        description: editedDescription,
        url: editedUrl,
        rating: editedRating,

        addCategoriesByIds: categoriesToAddIds,
        removeCategoriesByIds: categoriesToRemoveIds,
        addFoldersByIds: foldersToAddIds,
        removeFoldersByIds: foldersToRemoveIds,
      })

      fetchContents();
    } catch (error: any) {
      SwalUtils.fireModal({
        title: "Erro ao editar conteúdo",
        text: 'message' in error ? error.message : '',
        icon: 'error',
      });
    }

    setShowEditModal(false);
    setIsEditing(false);
    setEditedContent(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedUrl('');
    setEditedRating(1);

    cleanCategoriesAndFolders()
  };

  const cleanCategoriesAndFolders = () => {
    setCategoriesToRemoveIds([]);
    setCategoriesToRemove([]);
    setCategoriesToAddIds([]);
    setCategoriesStateSelected([]);

    setFoldersToRemoveIds([]);
    setFoldersToAddIds([]);
    setFoldersToRemove([]);
    setFoldersStateSelected([]);
  };

  const handleAddContent = async () => {
    try {
      await UniversimeApi.Capacity.createContent({
        title: newTitle,
        description: newDescription,
        url: newUrl,
        rating: newRating,
        type: newType,
        addCategoriesByIds: categoriesToAddIds,
        addFoldersByIds: foldersToAddIds,
      })

    } catch (error: any) {
        SwalUtils.fireModal({
            title: "Erro ao criar conteúdo",
            text: 'message' in error ? error.message : '',
            icon: "error",
        });
    }

    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
    setNewRating(1);

    cleanCategoriesAndFolders()
    fetchContents();
  };

  const handleCreateContent = async () => {
    setShowAddModal(true);

    cleanCategoriesAndFolders()

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

  const handleFoldersOnChange = (value: any) => {
    let difference = foldersStateSelected.filter((x: any) => !value.includes(x))
    setFoldersStateSelected(value)

    let foldersToRem = foldersToRemove
    foldersToRem = [...foldersToRem, ...difference]
    foldersToRem = foldersToRem.reduce(function (acc: any, curr: any) {
      if (!acc.includes(curr) && !value.includes(curr))
          acc.push(curr);
          return acc;
    }, []);
    setFoldersToRemove(foldersToRem)

    const foldersRemoveArr: string[] = [];
    foldersToRem.map((folder: any) => {
      return foldersRemoveArr.push(folder.value);
    });
    setFoldersToRemoveIds(foldersRemoveArr)
    
    const foldersAddArr: string[] = [];
    value.map((folder: any) => {
      return foldersAddArr.push(folder.value);
    });
    setFoldersToAddIds(foldersAddArr)
  };


  const handleTypeOnChange = (value: any) => {
    setNewType(value.value)
  }

  const auth = useContext(AuthContext);

  return (
    !auth.user ? null :
    <div>
        <h1 className="title-page">Gerenciador de Conteúdos</h1>
        <button className='button-adicionar' type="button" onClick={() => handleCreateContent()}>Adicionar conteúdo</button>
            <table className="contents-table">
                <thead>
                     <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>URL</th>
                        <th>Classificação</th>
                        <th>Categorias</th>
                        <th>Tipo</th>
                        <th>Pastas</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {contents.map((content) => (
                        <tr key={content.id}>
                        <td>{content.id}</td>
                        <td>{content.title}</td>
                        <td>{content.url}</td>
                        <td>{content.rating}</td>
                        <td>{content.categories?.map(function(elem){ return elem.name; }).join(", ")}</td>
                        <td>{content.type}</td>
                        <td>{content.folders?.map(function(elem){ return elem.name; }).join(", ")}</td>
                        <td>
                            <button className='button-edit' onClick={() => handleEditClick(content)}>Editar</button>
                            <button className='button-delete' type="button" onClick={() => handleDeleteClick(content)}>Deletar</button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showConfirmation && (
            <div className="confirmation-container">
                <div className="confirmation-box-delete">
                    <h2 className="titulo-box">Confirmar exclusão</h2>
                    <p>Deseja deletar o conteúdo "{selectedContent?.title}" ?</p>
                    <div className="confirmation-buttons">
                    <button className="button-boxCancel" onClick={() => setShowConfirmation(false)}>Cancelar</button>
                    <button className="button-boxDelete" onClick={handleDeleteContent}>Deletar</button>
                    </div>
                </div>
            </div>
            )}
            {showEditModal && (
        <div className="confirmation-container">
          <div className="confirmation-box-edit">
            <h2 className="titulo-box">Editar conteúdo</h2>
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
              <label>Pastas:</label>
              <Select placeholder= "Selecionar Pastas..."  isMulti name="playlists" options={folders} className="basic-multi-select" theme={(theme) => ({
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
              onChange={handleFoldersOnChange} value={foldersStateSelected} classNamePrefix="select" noOptionsMessage={()=>"Pasta Não Encontrada"} />
            </div>
            <div style={{marginTop: '35px'}} className="confirmation-buttons">
              <button className='button-boxCancel' onClick={() => setShowEditModal(false)}>Cancelar</button>
              <button className='button-boxSalve' onClick={handleEditContent}>Salvar</button>
            </div>
          </div>
        </div>
      )} 
      {showAddModal && (
        <div className="confirmation-container">
          <div className="confirmation-box-edit">
            <h2 className="titulo-box">Adicionar conteúdo</h2>
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
              <label>Pastas:</label>
              <Select placeholder= "Selecionar Pastas..."  isMulti name="playlists" options={folders} className="basic-multi-select" theme={(theme) => ({
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
              onChange={handleFoldersOnChange} value={foldersStateSelected} classNamePrefix="select" noOptionsMessage={()=>"Pasta Não Encontrada"} />
            </div>
            <div style={{ marginTop: '35px' }} className="confirmation-buttons">
              <button className='button-boxCancel' onClick={() => setShowAddModal(false)}>Cancelar</button>
              <button className='button-boxSalve' onClick={handleAddContent}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
};

export default CrudTela;
