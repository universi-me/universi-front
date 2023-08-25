import React from 'react';
import Carousel from './Components/Carousel/CustomCarousel';
import PlaylistRecomendada from './Components/PlaylistBar/PlaylistBarInitial'
import PlaylistSecundary from './Components/PlaylistBar/PlaylistBarSecundary'
import PlaylistTertiary from './Components/PlaylistBar/PlaylistBarTertiary'
import PlaylistBarOther from './Components/PlaylistBar/PlaylistBarOther'
import AllCategories from './Components/ButtonCategory/ButtonCategory'
import AnimationHome from './Components/Animation/VideoHomeCapacity'
import NavbarCategory from './Components/NavbarSide/NavbarCategory'
import AllPlaylists from './Components/PlaylistBar/AllPlaylists';
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
                <AllPlaylists />
                <AnimationHome/>
                <NavbarCategory />
                <Footer />
            </div>
      </div>
    </div>
  );
};

export default CapacityPage;
