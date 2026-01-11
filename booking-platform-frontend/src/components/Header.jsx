// ... (imports)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <header className="main-header"> {/* Updated class name */}
      <nav className="header-nav"> {/* Updated class name */}
        <Link to="/" className="header-logo"> {/* Updated class name */}
          BookPro
        </Link>
        <div className="header-links"> {/* Updated class name */}
          <Link to="/" className="nav-link">Services</Link>
          
          {token ? (
            <>
              <Link to="/my-bookings" className="nav-link">My Bookings</Link>
              <button onClick={handleLogout} className="nav-link logout-btn"> {/* Updated class name */}
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link auth-link">Login / Register</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

// **NOTE:** You should remove the inline style constants (headerStyle, navStyle, etc.)

export default Header;