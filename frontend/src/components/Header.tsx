import { useLocation, Link } from "react-router-dom";
import "./Header.css";
import { useEffect } from "react";
import type { HeaderList } from "../types/navigation.types";

const navigationItems: { key: HeaderList; label: string; path: string }[] = [
  { key: "Home", label: "Home", path: "/" },
  { key: "About me", label: "About me", path: "/about" },
  { key: "Contact", label: "Contact", path: "/contact" },
  { key: "Projects", label: "Projects", path: "/projects" },
];

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
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
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
