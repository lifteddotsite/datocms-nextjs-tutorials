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

  const res = await client.query({ query });
  const rawCompanies = res.data.allCompanies;
  const companies = rawCompanies.map((company) => companyReducer(company));
  return companies;
};

export const searchCompanies = async ({ search }) => {
  if (!search) return [];
  const query = gql`
    query searchCompanies($search: String!) {
      allCompanies(
        filter: {
          OR: [
            { name: { matches: { pattern: $search, caseSensitive: false } } }
            { city: { matches: { pattern: $search, caseSensitive: false } } }
            { slogan: { matches: { pattern: $search, caseSensitive: false } } }
            { website: { matches: { pattern: $search, caseSensitive: false } } }
          ]
        }
      ) {
        id
        name
      }
    }
  `;

  const variables = { search };

  const rawCompanies = await client.query({ query, variables });
  return rawCompanies.data.allCompanies;
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
  const slugs = rawSlugs.data.allCompanies.map((rawSlug) => {
    return rawSlug.slug;
  });
  return slugs;
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
  return companyReducer(rawCompany.data.company);
};
