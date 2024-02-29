import React, { useState, useContext } from 'react';
import PaperPage from './Paper/PaperPage';
import './GroupConfigModal.css';
import { Group } from '@/types/Group';
import { GroupContext } from "@/pages/Group";

enum Tab {
    //INFO = 'Informações do Grupo',
    PERMISSIONS = 'Papéis de Usuário',
}

export function GroupConfigModal() {
  const groupContext = useContext(GroupContext);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PERMISSIONS);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='group-config'>
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={()=>{ groupContext?.setGroupConfigModalOpen(false); }}>
          &times;
        </span>
        <h2 className="title">Configurações do grupo {groupContext?.group.name}</h2>
        <div className="tab">
        { Object.keys(Tab).map((key, index, value) => (
            <button
            className={activeTab == Tab[key as keyof typeof Tab] ? 'active' : ''}
            onClick={() => handleTabChange(Tab[key as keyof typeof Tab])} >
            {(Tab as any)[key]}
          </button>
        ))}
        </div>
        <div className="tab-content">
          {activeTab === Tab.PERMISSIONS && (
            <div>
             { <PaperPage group={groupContext?.group}/> }
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default GroupConfigModal;
