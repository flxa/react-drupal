import gql from "graphql-tag";

const GET_USERS = gql`
  {
    userQuery {
      entities {
        entityLabel
        entityId
        entityBundle
      }
    }
  }
`;

export default GET_USERS;