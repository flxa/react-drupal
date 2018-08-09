import React from 'react';
import { Link } from 'react-router-dom'

const Menu = ({ refetch }) => {
  return <nav className="Menu">
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/about'>About</Link></li>
      <li><Link to='/contact'>Contact</Link></li>
      {
        refetch
          ? <li><a onClick={() => refetch()}>Refetch!</a></li>
          : ''
      }
    </ul>
  </nav>;
};

export default Menu;
