"use client";
import {FaCode, FaGithub, FaBook, FaLink} from "react-icons/fa";
import "./Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-section footer-brand">
                    <h3>
                        <FaGithub style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                        Github
                    </h3>
                    <p className="footer-description">My Github profile with all my projects</p>
                </div>
                <div className="footer-section">
                    <h3>
                        <FaLink style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                        Quick Links
                    </h3>
                </div>
                <div className="footer-section">
                    <h3>
                        <FaBook style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                        Resources
                    </h3>
                </div>
                <div className="footer-section">
                    <h3>
                        <FaCode style={{marginRight: '0.5rem', color: 'var(--primary)'}} />
                        Technologies
                    </h3>
                </div>
                
            </div>
        </div>
      
    </footer>
  );
}