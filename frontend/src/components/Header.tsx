import { Link } from "react-router-dom";
import "./Header.css";
import { useEffect } from "react";

export default function Header() {
  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.has("token")) {
      url.searchParams.delete("token");
      window.location.replace(url.toString());
    }
  }, []);

  // TypeScript-safe toggleMenu
  const toggleMenu = (): void => {
    const menu = document.querySelector<HTMLElement>(".menu-links");
    const icon = document.querySelector<HTMLElement>(".hamburger-icon");

    if (menu) {
      menu.classList.toggle("open");
    }
    if (icon) {
      icon.classList.toggle("open");
    }
  };

  return (
    <header className="header">
      <nav id="desktop-nav">
        <div className="logo">kurt v. a.</div>
        <div>
          <nav className={`header-nav`}>
            <Link to="/">Home</Link>
            <Link to="/about">About me</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </nav>
      <nav id="hamburger-nav">
        <div className="logo">kurt v. a.</div>
        <div className="hamburger-menu">
          <div className="hamburger-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="menu-links">
            <Link to="/">Home</Link>
            <Link to="/about">About me</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
