import gql from "graphql-tag";

const GET_PAGES = gql`
  {
    pages {
      edges {
        node {
          id
          title
          link
          slug
          date
          content
          featuredImage {
            id
            sourceUrl
          }
        }
      }
    }
  }
`;

export default GET_PAGES;