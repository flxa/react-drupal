import React from 'react';
import logo from '../Logo/logo.svg';
import '../../css/animations.css';
import './Loader.css';

const Loading = () => {
  return <img src={logo} alt='Loading' className='App-loader' />;
};

export default Loading;
