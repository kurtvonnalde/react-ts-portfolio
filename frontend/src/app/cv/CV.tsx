import "./CV.css";

export default function CV() {
  return (
    <div className="cv-page">
      <article className="cv-document">
        <header className="cv-header">
          <h1 className="cv-name">Full Name, Title</h1>
          <p className="cv-contact">
            Street Address, City – Region, Country
            <br />
            +00-000-000-00-00 · email@example.com
          </p>
        </header>

        <section className="cv-section">
          <div className="cv-section-label">PROFILE</div>
          <div className="cv-section-body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed
              metus a orci elementum luctus. Ut sit amet quam id ligula
              dignissim vestibulum. Fusce lobortis sagittis orci in porttitor.
              Sed metus nulla, rhoncus eu condimentum et, fringilla vitae nisl.
              Vestibulum congue rhoncus velit. Curabitur rhoncus finibus
              tellus, vel faucibus risus commodo id. Nullam ut fringilla ante.
              Nulla at fringilla nulla, et semper magna. Phasellus arcu augue,
              facilisis quis dui viverra, hendrerit sollicitudin nunc. Vivamus
              quis mauris fringilla.
            </p>
          </div>
        </section>

        <section className="cv-section">
          <div className="cv-section-label">EDUCATION</div>
          <div className="cv-section-body">
            <div className="cv-entry">
              <div className="cv-entry-date">DD/MM/YYYY – DD/MM/YYYY</div>
              <div className="cv-entry-main">
                <h3 className="cv-entry-title">Course / Degree, Institution</h3>
                <p className="cv-entry-subtitle">Role / Level</p>
              </div>
              <div className="cv-entry-location">City, Country</div>
            </div>

            <div className="cv-entry">
              <div className="cv-entry-date">DD/MM/YYYY – DD/MM/YYYY</div>
              <div className="cv-entry-main">
                <h3 className="cv-entry-title">Institution Name</h3>
                <p className="cv-entry-subtitle">Degree, Level</p>
                <ol className="cv-entry-list">
                  <li>
                    <strong>Lorem ipsum</strong> dolor sit amet, consectetur.
                  </li>
                  <li>
                    <strong>Cras sed metus</strong> a orci elementum luctus.
                  </li>
                </ol>
              </div>
              <div className="cv-entry-location">City, Country</div>
            </div>
          </div>
        </section>

        <section className="cv-section">
          <div className="cv-section-label">EXPERIENCE</div>
          <div className="cv-section-body">
            <div className="cv-entry">
              <div className="cv-entry-date">Mon YYYY – Present</div>
              <div className="cv-entry-main">
                <h3 className="cv-entry-title">Job Title, Company</h3>
                <p className="cv-entry-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  sed metus a orci elementum luctus. Ut sit amet quam id ligula
                  dignissim vestibulum. Fusce lobortis sagittis orci in
                  porttitor. Sed metus nulla, rhoncus eu condimentum et,
                  fringilla vitae nisl. Vestibulum congue.
                </p>
                <ul className="cv-entry-list">
                  <li>
                    <strong>Lorem ipsum</strong> dolor sit amet, consectetur.
                  </li>
                  <li>
                    <strong>Cras sed metus</strong> a orci elementum luctus.
                  </li>
                </ul>
              </div>
              <div className="cv-entry-location">City, Country</div>
            </div>

            <div className="cv-entry">
              <div className="cv-entry-date">Mon YYYY – Mon YYYY</div>
              <div className="cv-entry-main">
                <h3 className="cv-entry-title">Job Title, Company</h3>
                <p className="cv-entry-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  sed metus a orci elementum luctus. Ut sit amet quam id ligula
                  dignissim vestibulum. Fusce lobortis sagittis orci in
                  porttitor. Sed metus nulla, rhoncus eu condimentum et,
                  fringilla vitae nisl. Vestibulum congue.
                </p>
              </div>
              <div className="cv-entry-location">City, Country</div>
            </div>

            <div className="cv-entry">
              <div className="cv-entry-date">Mon YYYY – Mon YYYY</div>
              <div className="cv-entry-main">
                <h3 className="cv-entry-title">Job Title, Company</h3>
                <p className="cv-entry-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  sed metus a orci elementum luctus. Ut sit amet quam id ligula
                  dignissim vestibulum. Fusce lobortis sagittis orci in
                  porttitor. Sed metus nulla, rhoncus eu condimentum et,
                  fringilla vitae nisl. Vestibulum congue. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Cras sed metus a orci
                  elementum luctus. Ut sit amet quam id ligula dignissim
                  vestibulum. Fusce lobortis sagittis orci in porttitor. Sed
                  metus nulla, rhoncus eu condimentum et, fringilla vitae nisl.
                  Vestibulum congue.
                </p>
              </div>
              <div className="cv-entry-location">City, Country</div>
            </div>
          </div>
        </section>

        <section className="cv-section">
          <div className="cv-section-label">SKILLS</div>
          <div className="cv-section-body">
            <p className="cv-section-note">In decreasing order</p>
            <div className="cv-skills-grid">
              <div className="cv-skill">
                <span className="cv-skill-name">Skill One</span>
                <span className="cv-skill-level">Perfectly</span>
              </div>
              <div className="cv-skill">
                <span className="cv-skill-name">Skill Two</span>
                <span className="cv-skill-level">Good</span>
              </div>
              <div className="cv-skill">
                <span className="cv-skill-name">Skill Three</span>
                <span className="cv-skill-level">Very good</span>
              </div>
              <div className="cv-skill">
                <span className="cv-skill-name">Skill Four</span>
                <span className="cv-skill-level">Normal</span>
              </div>
              <div className="cv-skill">
                <span className="cv-skill-name">Skill Five</span>
                <span className="cv-skill-level">Good</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cv-section">
          <div className="cv-section-label">LANGUAGES</div>
          <div className="cv-section-body">
            <p className="cv-section-note">In decreasing order</p>
            <div className="cv-skills-grid">
              <div className="cv-skill">
                <span className="cv-skill-name">Language One</span>
                <span className="cv-skill-level">Perfectly</span>
              </div>
              <div className="cv-skill">
                <span className="cv-skill-name">Language Two</span>
                <span className="cv-skill-level">Good</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cv-section">
          <div className="cv-section-label">HOBBIES</div>
          <div className="cv-section-body">
            <p>Hobby one, Hobby two, Hobby three, Hobby four.</p>
          </div>
        </section>

        <section className="cv-section cv-section--meta">
          <div className="cv-meta-row">
            <div className="cv-section-label">Date / Place of birth</div>
            <div className="cv-meta-value">
              DD/MM/YYYY
              <br />
              City, Country
            </div>
            <div className="cv-section-label">Marital status</div>
            <div className="cv-meta-value">Status</div>
          </div>
          <div className="cv-meta-row">
            <div className="cv-section-label">Nationality / Gender</div>
            <div className="cv-meta-value">Nationality / Gender</div>
            <div></div>
            <div></div>
          </div>
        </section>
      </article>
    </div>
  );
}
