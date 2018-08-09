import React, { Component } from 'react';
import Header from '../Header';

class Contact extends Component {
  render() {
    return <div className="App">
      <Header appName="Contact"/>
      <div className="App-intro Posts">
        <div className="container">
          <h1>Contact</h1>
          <p>This is a contact form test page</p>
        </div>
      </div>
    </div>
  }
}

export default Contact;
