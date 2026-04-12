import {
  FaLinkedin,
  FaReact,
  FaCss3,
  FaGithub,
  FaMedal,
  FaSchool,
  
} from "react-icons/fa";
import "./Home.css";

export default function Home() {
  return (
    <div>
      <section id="profile">
        <div className="section__pic-container profile">
          <img src="/images/profile.jpg" alt="John Doe profile picture" />
        </div>
        <div className="section__text">
          <p className="section__text__p1">Hello, I'm</p>
          <h1 className="title">Kurt Vonn Alde</h1>
          <p className="section__text__p2">Software Engineer</p>
          <div className="btn-container">
            <button className="control-button primary">Download CV</button>
            <button className="control-button secondary">Project Repo</button>
          </div>
          <div id="socials-container">
            <a href="">
        <FaGithub
              style={{
                marginRight: "0.5rem",
                color: "var(--primary)",
                fontSize: "2.1rem",
              }}
            />
            </a>
            
            <a href="https://www.linkedin.com/in/kurt-vonn-alde-780b3b265/">
              <FaLinkedin
                style={{
                  marginRight: "0.5rem",
                  color: "var(--primary)",
                  fontSize: "2.1rem",
              }}
            />
            </a>
          </div>
        </div>
      </section>
      <section id="about">
        <p className="section__text__p1">Get To Know More</p>
        <h1 className="title">About Me</h1>
        <div className="section-container">
          <div className="section__pic-container about">
            <img
              src="/images/aboutimage.jpg"
              alt="Profile picture"
              className="about-pic"
            />
          </div>
          <div className="about-details-container">
            <div className="about-containers">
              <div className="details-container">
                <FaMedal size={40} color="#0A66C2" />
                <h3>Experience</h3>
                <p>
                  3+ years <br />
                  Software Engineer
                </p>
              </div>
              <div className="details-container">
                <FaSchool size={40} color="#0A66C2" />
                <h3>Education</h3>
                <p>
                  B.S. Information Technology
                  <br />
                  La Salle University
                </p>
              </div>
            </div>
            <div className="text-container">
              <p>
                I’m Kurt Vonn Alde, an aspiring AI Full Stack Developer with a
                growing focus on building intelligent applications using Azure,
                React + Vite + TypeScript, and Python. My professional
                background includes Power BI development at Accenture, where I
                design interactive dashboards and optimize data models, as well
                as low‑code application development with Mendix. Alongside these
                experiences, I’ve been expanding my skills in AI and cloud
                technologies, working on beginner projects that integrate
                machine learning concepts with modern web frameworks. With a
                strong foundation in IT and a passion for continuous learning, I
                aim to bridge data, cloud, and front‑end technologies to create
                scalable solutions that deliver real value.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="experience">
        <p className="section__text__p1">Explore My</p>
        <h1 className="title">Technologies</h1>
        <div className="experience-details-container">
          <div className="about-containers">
            <div className="details-container">
              {/* <h2 className="experience-sub-title">Frontend Development</h2> */}
              <div className="article-container">
                <article>
                  <FaReact
                    size={37}
                    color="#0A66C2"
                    style={{ marginRight: "0.5rem" }}
                  />
                  <div>
                    <h3>React</h3>
                    <p>Experienced</p>
                  </div>
                </article>
                <article>
                  <FaCss3
                    size={37}
                    color="#0A66C2"
                    style={{ marginRight: "0.5rem" }}
                  />
                  <div>
                    <h3>CSS</h3>
                    <p>Experienced</p>
                  </div>
                </article>
                <article>
                  <img
                    src="/images/sql.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>SQL</h3>
                    <p>Experienced</p>
                  </div>
                </article>
                <article>
                  <img
                    src="/images/mendix.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>Mendix</h3>
                    <p>Experienced</p>
                  </div>
                </article>
                <article>
                  <img
                    src="/images/typescript.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>TypeScript</h3>
                    <p>Basic</p>
                  </div>
                </article>
                <article>
                  <img
                    src="/images/powerbi.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>PowerBI</h3>
                    <p>Experienced</p>
                  </div>
                </article>
              </div>
            </div>
            <div className="details-container">
              {/* <h2 className="experience-sub-title">Frontend Development</h2> */}
              <div className="article-container">
                <article>
                  <img
                    src="/images/azure.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>Azure</h3>
                    <p>Intermediate</p>
                  </div>
                </article>
                <article>
                  <img
                    src="/images/powerautomate.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>Power Automate</h3>
                    <p>Bsic</p>
                  </div>
                </article>
                <article>
                  <img
                    src="/images/python.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>Python</h3>
                    <p>Intermediate</p>
                  </div>
                </article>
                <article>
                  <img
                    src="/images/openAI.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>OpenAI</h3>
                    <p>Intermediate</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="projects">
        <p className="section__text__p1">Browse My Recent</p>
        <h1 className="title">Projects</h1>
        <div className="experience-details-container">
          <div className="about-containers">
            <div className="details-container color-container">
              <div className="article-container">
                <img
                  src="/images/healthcare.png"
                  alt="Project 1"
                  className="project-img"
                />
              </div>
              <h2 className="experience-sub-title project-title">
                RAG Chat App
              </h2>
              <div className="btn-container">
                <button className="btn btn-color-2 project-btn">Github</button>
              </div>
            </div>
            <div className="details-container color-container">
              <div className="article-container">
                <img
                  src="/images/Portfolio.png"
                  alt="Project 2"
                  className="project-img"
                />
              </div>
              <h2 className="experience-sub-title project-title">Portfolio</h2>
              <div className="btn-container">
                <button className="btn btn-color-2 project-btn">Github</button>
                <button className="btn btn-color-2 project-btn">
                  Live Demo
                </button>
              </div>
            </div>
            </div>
        </div>
      </section>
      {/* <section id="contact">
        <p className="section__text__p1">Get in Touch</p>
        <h1 className="title">Contact Me</h1>
        <div className="contact-info-upper-container">
          <div className="contact-info-container">
            <FaEnvelope style={{
                marginRight: "0.5rem",
                color: "var(--primary)",
                fontSize: "2rem",
              }} className="email-icon" />
            <p>
              <a href="mailto:kurtvonn98@gmail.com">kurtvonn98@gmail.com</a>
            </p>
          </div>
          <div className="contact-info-container">
            <FaLinkedin style={{
                marginRight: "0.5rem",
                color: "var(--primary)",
                fontSize: "2rem",
              }} className="contact-icon" />
            <p>
              <a href="https://www.linkedin.com/in/kurt-vonn-alde-780b3b265/">LinkedIn</a>
            </p>
          </div>
        </div>
      </section> */}
    </div>
  );
}
