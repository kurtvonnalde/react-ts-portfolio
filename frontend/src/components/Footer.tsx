import {FaCode, FaGithub, FaBook, FaLink, FaReact, FaLaptopCode, FaUserFriends, FaLinkedin, FaFacebook} from "react-icons/fa";
import "./Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-section footer-brand">
                    <h3>
                        <FaUserFriends style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                        Socials
                    </h3>
                    <ul>
                        <li>
                             <a href="" target="_blank" rel="noopener noreferrer">
                                <FaGithub style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                                GitHub
                            </a>
                        </li>
                        <li>
                             <a href="" target="_blank" rel="noopener noreferrer">
                                <FaFacebook style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                                Facebook
                            </a>
                        </li>
                        <li>
                             <a href="" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>
                        <FaLink style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                        Quick Links
                    </h3>
                    <ul>
                        <li>
                            <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                                Home
                            </a>
                           </li>
                           <li>
                             <a href="https://typescriptlang.org" target="_blank" rel="noopener noreferrer">
                             About
                            </a>
                           </li>
                            <li>
                                  <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer">
                                Contact
                            </a>
                            </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>
                        <FaBook style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                        Resources
                    </h3>
                </div>
                <div className="footer-section">
                    <h3>
                        <FaLaptopCode style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                        Technologies
                    </h3>
                    <ul>
                        <li>
                            <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                                <FaReact style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                                React
                            </a>
                           </li>
                           <li>
                             <a href="https://typescriptlang.org" target="_blank" rel="noopener noreferrer">
                                <FaCode style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                                TypeScript
                            </a>
                           </li>
                            <li>
                                  <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer">
                                <FaCode style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                                Tailwind CSS
                            </a>
                            </li>
                    </ul>
                </div>
                
            </div>
        </div>
      
    </footer>
  );
}