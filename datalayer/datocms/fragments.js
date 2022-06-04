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
      mimeType
      url
      height
      width
      id
    }
    logo {
      alt
      filename
      mimeType
      url
      height
      width
      id
    }
  }
`;

export const JobFragment = gql`
  fragment JobFragment on JobRecord {
    id
    title
    slug
    remoteok
    featuredjob
    baseannualsalary
    dateposted
    experiencelevel
    jobtype
    jobcategory
    applicationlink
    company {
      id
      name
      city
      slug
      logo {
        alt
        filename
        mimeType
        url
        height
        width
        id
      }
    }
    skillstags {
      id
      name
    }
    aboutyou {
      value
    }
    jobresponsibilities {
      value
    }
    jobdescription {
      value
    }
    remunerationpackage {
      value
    }
  }
`;
