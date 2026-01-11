import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer"> {/* Updated class name */}
      <p>&copy; {new Date().getFullYear()} Booking Platform. All rights reserved.</p>
    </footer>
  );
};

// **NOTE:** You should remove the inline style constant (footerStyle)

export default Footer;