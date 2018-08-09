import gql from "graphql-tag";

const GET_POSTS = gql`
  {
    posts {
      edges {
        node {
          id
          title
          content
          link
          slug
          date
          featuredImage {
            id
            sourceUrl
          }
          categories {
            edges {
              node {
                id
                link
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export default GET_POSTS;