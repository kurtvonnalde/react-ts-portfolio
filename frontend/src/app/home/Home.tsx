
import { ComingSoon } from "../../components/ComingSoon/page";
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";
import "./Home.css"

export default function Home() {
  return (
    
        <section id="profile">
            <ComingSoon >
            <div className="section-img-container">
                <img src="/images/hero.png" alt="Home" />
            </div>
            <div className="section-text">
                <p className="section-greetings">Hello, I'm</p>
                <h1 className="section-name">Kurt Vonn Alde</h1>
                <p className="section-role">Software Engineer</p>
                <div className="button-container">
                    <button className="control-button primary">
                     Download CV
                    </button>
                    <button className="control-button secondary">
                        LinkedIn
                    </button>
            </div>
            <div className="socials-container">
                <a href="" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin style={{marginRight: '0.5rem', color: 'var(--primary)', fontSize: '1.5rem'}} />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                    <FaFacebook style={{marginRight: '0.5rem', color: 'var(--primary)', fontSize: '1.5rem'}} />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                    <FaGithub style={{marginRight: '0.5rem', color: 'var(--primary)', fontSize: '1.5rem'}} />
                </a>

            </div>
            </div>
            </ComingSoon>
        </section>
  );
}