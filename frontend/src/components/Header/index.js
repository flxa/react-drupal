import React from 'react';
import logo from '../Logo/logo.svg';
import Menu from '../Menu'

const Header = ({ appName = 'React GraphQL app', children, refetch }) => {
  return <header className="App-header">
    <img src={logo} alt="React app" className="App-logo"/>
    <h1 className="App-title">{ appName }</h1>
    <Menu refetch={refetch}/>
  </header>;
};

export default Header;
