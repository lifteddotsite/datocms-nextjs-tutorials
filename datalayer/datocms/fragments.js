import gql from 'graphql-tag';

export const CompanyFragment = gql`
  fragment CompanyFragment on CompanyRecord {
    id
    name
    slug
    slogan
    city
    updatedAt
    website
    coverimage {
      alt
      filename
      url
      height
      width
      id
    }
    logo {
      alt
      filename
      url
      height
      width
      id
    }
  }
`;
