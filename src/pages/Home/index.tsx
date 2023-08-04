import "./styles.css";
import Wave from "../../../public/assets/imgs/wave-background.svg";
import SocialNetwoork from "../../../public/assets/imgs/social-network.svg";
import Logo from "../../../public/assets/imgs/u-logo.svg";
import { BenefitCard } from "./components/BenefitCard";
import { FiUsers, FiVideo } from "react-icons/fi";

export function Home() {
  return (
    <div className="home-container">
      <main>
        <section className="about-box">
          <div className="about-box-content">
            <div className="about-box-content-left">
              <strong>Sua rede social de desenvolvimento pessoal!</strong>
              <span>
                Lorem ipsum dolor sit amet. Qui voluptatibus laudantium sed
                animi explicabo ut sunt itaque qui cumque voluptas ut
                necessitatibus voluptatibus et veritatis doloribus qui modi
                provident.
              </span>

              <button type="button">ENTRE AGORA MESMO</button>
            </div>

            <div className="about-box-content-right">
              <img src={Logo} alt="" />
            </div>
          </div>
        </section>

        <section className="benefits-box">
          <strong className="benefits-box-description">
            Benefícios que encontrará na nossa rede social
          </strong>

          <div className="benefits-box-content">
            <BenefitCard title="Defina suas competências" icon={<FiUsers />} />

            <BenefitCard
              title=" Acesso à biblioteca de capacitações"
              icon={<FiUsers />}
            />

            <BenefitCard
              title="Crie grupos de projetos diversos"
              icon={<FiUsers />}
            />

            <BenefitCard title="Elabore seu currículo" icon={<FiUsers />} />
          </div>

          <div className="benefits-box-footer">
            <strong className="benefits-box-description">
              ...e muito mais
            </strong>
            <strong className="benefits-box-description">
              Gostou? Se cadastre!
            </strong>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer-img">
          <img src={SocialNetwoork} alt="" />
        </div>

        <div className="home-footer-content">
          <div className="home-footer-span-description">
            <strong>
              Nossa comunidade já conta com mais de <span>000</span> usuários.
            </strong>

            <span >
              Cadastre-se no Universi.me e aproveite os benefícios agora!
            </span>
          </div>

          <button>CLIQUE AQUI PARA COMEÇAR</button>
        </div>
      </footer>
    </div>
  );
}
