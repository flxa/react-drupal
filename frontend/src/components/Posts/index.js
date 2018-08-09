import React from 'react';
import Post from '../Post'

const Posts = ({ posts, errors }) => {
  if (errors) {
    return (
      <p>
        <strong>Something went wrong:</strong>
        {errors.map(error => error.message).join(' ')}
      </p>
    );
  }

  return posts.posts.edges.map(post => {
    return <Post post={post.node} key={post.node.id} />;
  });
};

export default Posts;
