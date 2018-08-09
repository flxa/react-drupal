import React, { Component } from 'react';
import Header from '../Header';

class About extends Component {
  render() {
    return <div className="App">
      <Header appName="About"/>
      <div className="App-intro Posts">
        <div className="container">
          <h1>About</h1>
          <p>This is an about form test page</p>
        </div>
      </div>
    </div>
  }
}

export default About;
