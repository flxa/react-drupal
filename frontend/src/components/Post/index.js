import React from 'react';
import htmlParser from 'html-parser';

const stripTags = (originalString) => {
  const cleaned = htmlParser.sanitize(originalString, {
    elements: [ 'script' ],
    comments: true
  });
  return cleaned.replace(/(<([^>]+)>)/ig,"");
};

const Post = ({ post }) => {
  const shortText = stripTags(post.content);
  return <a href={post.link} className="Post-card" key={post.id}>
    {
      post.featuredImage
        ? <img src={post.featuredImage.sourceUrl} alt="" className="Post-image" />
        : ''
    }
    <h2 className="Post-title">{post.title}</h2>
    <p className="Post-excerpt">{shortText.slice(0, 120)}...</p>
    <time>{post.date}</time>
  </a>;
};

export default Post;
