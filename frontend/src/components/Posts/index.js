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

  if (!posts) {
    return <div className='error'>No post data</div>;
  }

  return posts.nodeQuery.entities.map(post => {
    return <Post post={post} key={post.entityUuid} />;
  });
};

export default Posts;
