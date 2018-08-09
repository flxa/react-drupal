import React from 'react';

const Post = ({ post }) => {
  return <a href={post.entityUrl.path} className='Post-card' key={post.entityUuid}>
    <h2 className='Post-title'>{post.entityLabel}</h2>
    <p className='Post-excerpt'>{post.entityBundle}</p>
    <time>{post.entityUuid}</time>
  </a>;
};

export default Post;
