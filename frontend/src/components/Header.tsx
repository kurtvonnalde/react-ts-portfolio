import { Link } from "react-router-dom";
import "./Header.css"

export default function Header() {
  return (
    <header className="header">
        <div className='header-container'>
            <div className='header-logo'>
                <h1>Logo</h1>
            </div>
             <nav className={`header-nav`}>
                <Link to="/">Home</Link>
                <Link to="/about">About me</Link>
                <Link to="/contact">Contact</Link>
             </nav>
        </div>
    </header>
  );
}