import "./styles.css";
import Wave from "../../../public/assets/imgs/wave-background.svg";
import Logo from "../../../public/assets/imgs/u-logo.svg";

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

              <button type="button" >ENTRE AGORA MESMO</button>
            </div>

            <div className="about-box-content-right">
              <img src={Logo} alt="" />
            </div>
          </div>
        </section>

        <section></section>
      </main>
    </div>
  );
}
