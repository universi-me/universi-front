import React from 'react';
import AllCategories from './Components/ButtonCategory/ButtonCategory'
import AllFolders from './Components/FolderBar/AllFolders';
import Footer from '../../components/Footer/Footer';

import './Capacity.css'
import '@/layouts/fonts.less'

const CapacityPage: React.FC = () => {
  return (
    <div className="capacity-tela">
      <div id="home">
            <div id="conteudo-folder">
                <AllCategories />
                <AllFolders />
                <Footer />
            </div>
      </div>
    </div>
  );
};

export default CapacityPage;
