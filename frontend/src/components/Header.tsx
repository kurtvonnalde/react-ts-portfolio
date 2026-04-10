import { Link } from "react-router-dom";
import AuthButtons from "../app/auth/AuthButtons";
import "./Header.css"
import { useEffect } from "react";



export default function Header() {

  useEffect(() => {
    const url = new URL(window.location.href);

    if  (url.searchParams.has("token")){
      url.searchParams.delete("token");
      window.location.replace(url.toString());
    }

  }, []);

  return (
    <header className="header">
        <div className='header-container'>
            <div className='header-logo'>
                <h1>Kurt v. a.</h1>
            </div>
             <nav className={`header-nav`}>
                <Link to="/">Home</Link>
                <Link to="/about">About me</Link>
                <Link to="/contact">Contact</Link>
                <AuthButtons />
             </nav>
        </div>
    </header>
  );
}