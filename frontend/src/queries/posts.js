import gql from "graphql-tag";

const GET_POSTS = gql`
  {
    nodeQuery {
      entities {
        entityId
        entityUuid
        entityLabel
        entityType
        entityBundle
        entityUrl {
          path
          routed
        }
      }
      count
    }
  }
`;

export default GET_POSTS;