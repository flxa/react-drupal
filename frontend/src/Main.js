import React from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Switch, Route } from 'react-router-dom'
import App from './components/App';
import About from './components/About';
import Contact from './components/Contact';
import './Main.css';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json;'
  }
});

const Main = () => <ApolloProvider client={client}>
  <Switch>
    <Route exact path='/' component={App} />
    <Route path='/about' component={About} />
    <Route path='/contact' component={Contact} />
  </Switch>
</ApolloProvider>;

export default Main;
