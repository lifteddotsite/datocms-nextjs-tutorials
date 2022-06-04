import gql from 'graphql-tag';

import { client } from './client';
import { companyReducer } from './utils';
import { CompanyFragment } from './fragments';

export const getCompanies = async () => {
  const query = gql`
    ${CompanyFragment}
    query {
      allCompanies {
        ...CompanyFragment
      }
    }
  `;

  const rawCompanies = await client.query({ query });
  return rawCompanies;
};

export const getCompaniesSlugs = async () => {
  const query = gql`
    query {
      allCompanies {
        slug
      }
    }
  `;

  const rawSlugs = await client.query({ query });
  return rawSlugs;
};

export const getCompanyBySlug = async ({ slug }) => {
  const query = gql`
    ${CompanyFragment}
    query getCompanyBySlug($slug: String!) {
      company(filter: { slug: { eq: $slug } }) {
        ...CompanyFragment
      }
    }
  `;
  const variables = { slug };
  const rawCompany = await client.query({ query, variables });
  return rawCompany;
};
