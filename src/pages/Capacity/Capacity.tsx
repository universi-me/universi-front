import React from 'react';
import Carousel from './Components/Carousel/CustomCarousel';
import PlaylistRecomendada from './Components/FolderBar/FolderBarInitial'
import PlaylistSecundary from './Components/FolderBar/FolderBarSecundary'
import PlaylistTertiary from './Components/FolderBar/FolderBarTertiary'
import PlaylistBarOther from './Components/FolderBar/FolderBarOther'
import AllCategories from './Components/ButtonCategory/ButtonCategory'
import AnimationHome from './Components/Animation/VideoHomeCapacity'
import NavbarCategory from './Components/NavbarSide/NavbarCategory'
import AllFolders from './Components/FolderBar/AllFolders';
import Footer from '../../components/Footer/Footer';

import './Capacity.css'
import '@/layouts/fonts.less'

const CapacityPage: React.FC = () => {
  const slides = [
    "/assets/imgs/Capacity_img/SliderHome/slider_1.png",
    "/assets/imgs/Capacity_img/SliderHome/slider_2.png",
    "/assets/imgs/Capacity_img/SliderHome/slider_3.png",
  ];

  return (
    <div className="capacity-tela">
      <div id="home">
            <div id="conteudo-playlist">
                <AllCategories />
                <AllFolders />
                <Footer />
            </div>
      </div>
    </div>
  );
};

export default CapacityPage;
