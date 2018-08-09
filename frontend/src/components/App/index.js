import React, { Component } from 'react';
import Header from '../Header';
import Loading from '../Loading';
import { Query } from "react-apollo";
import GET_POSTS from '../../queries/posts'
import Posts from '../Posts'

class App extends Component {
  render() {
    return <Query
      query={GET_POSTS}
      notifyOnNetworkStatusChange
      pollInterval={0}
      >
      {({ loading, error, data, refetch, networkStatus }) => {
        let isLoading = loading;
        if (networkStatus === 4) {
          isLoading = true;
        }
        if (error) {
          isLoading = false;
        }

        return (
          <div className='App'>
            <Header appName='React Posts' refetch={refetch} />
            {
              isLoading
                ? <div className='App-intro Posts'><Loading /></div>
                : error
                  ? <div className='App-intro Posts'><Error error={error} /></div>
                  : <div className='App-intro Posts'><Posts posts={data} /></div>
            }
          </div>
        );
      }}
    </Query>;
  }
}

const Error = ({ error }) => {
  return <div className='App-error'>
    { error.toString() }
  </div>;
};

export default App;
