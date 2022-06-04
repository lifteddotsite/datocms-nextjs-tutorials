import gql from 'graphql-tag';
import { print } from 'graphql';

import { client } from './client';
import { jobReducer, skillsReducer, tagsReducer } from './utils';

import { JobFragment } from './fragments';
import { searchCompanies } from './company';

export const getJobs = async () => {
  const query = gql`
    ${JobFragment}
    query {
      allJobs {
        ...JobFragment
        relatedjobs {
          ...JobFragment
        }
      }
    }
  `;

  const rawJobs = await client.query({ query });
  return rawJobs;
};

export const getJobsSkills = async () => {
  const query = gql`
    query getJobsSkills($tagtype: String!) {
      allTags(filter: { tagtype: { eq: $tagtype } }) {
        name
        id
      }
    }
  `;
  const variables = { tagtype: 'skill' };
  const rawJobsSkills = await client.query({ query, variables });
  return rawJobsSkills;
};

export const searchJobsSkills = async ({ seletedTags, search = '' }) => {
  const query = gql`
    query searchJobsSkills(
      $tagtype: String!
      $seletedTags: [String]
     ${search ? '$search: String!' : ''}
    ) {
      allTags(
        filter: {
          OR: [
            { name: { in: $seletedTags } }
           ${
             search
               ? ' { name: { matches: { pattern: $search, caseSensitive: false } } }'
               : ''
           }
          ]
          tagtype: { eq: $tagtype }
        }
      ) {
        id
        name
      }
    }
  `;

  const variables = { tagtype: 'skill', seletedTags };
  if (search) variables.search = search;

  const rawTags = await client.query({ query, variables });
  return rawTags.data.allTags;
};

export const getJobsSlugs = async () => {
  const query = gql`
    query {
      allJobs {
        slug
      }
    }
  `;

  const rawSlugs = await client.query({ query });
  return rawSlugs;
};

export const getJobBySlug = async ({ slug }) => {
  const query = gql`
    ${JobFragment}
    query getJobBySlug($slug: String!) {
      job(filter: { slug: { eq: $slug } }) {
        ...JobFragment
      }
    }
  `;
  const variables = { slug };
  const rawJob = await client.query({ query, variables });
  return rawJob;
};

export const getJobsByCompanyId = async ({ id }) => {
  const query = gql`
    ${JobFragment}
    query getJobsByCompanyId($companyId: ItemId!) {
      allJobs(filter: { company: { eq: $companyId } }) {
        ...JobFragment
      }
    }
  `;
  const variables = { companyId: id };
  const rawJobs = await client.query({ query, variables });
  return rawJobs;
};

export const searchJobs = async (query) => {
  const {
    searchBarText: search,
    remoteOkOnly,
    featuredJobsOnly,
    minBaseSalary,
    maxBaseSalary,
    jobTypes,
    experienceLevels,
    seletedTags,
  } = query;

  const matchingCompanies = await searchCompanies({ search });
  const matchingCompaniesIds = matchingCompanies.length
    ? matchingCompanies.map((company) => company.id)
    : [];

  const machingTags = await searchJobsSkills({ seletedTags, search });
  const machingTagsIds = machingTags.length
    ? machingTags.map((tag) => tag.id)
    : [];

  const searchFilters = `
    OR: [
        { title: { matches: { pattern: $search, caseSensitive: false } } }
        {
          jobcategory: {
            matches: { pattern: $search, caseSensitive: false }
          }
        }
        { jobdescription: { matches: { pattern: $search, caseSensitive: false } } }
        { aboutyou: { matches: { pattern: $search, caseSensitive: false } } }
        { jobresponsibilities: { matches: { pattern: $search, caseSensitive: false } } }
        { remunerationpackage: { matches: { pattern: $search, caseSensitive: false } } }
    
        { experiencelevel: { matches: { pattern: $search, caseSensitive: false } } }
        { jobtype: { matches: { pattern: $search, caseSensitive: false } } }
        ${
          matchingCompaniesIds && matchingCompaniesIds.length
            ? '{company: {in: $matchingCompaniesIds}}'
            : ''
        }
        ${
          machingTagsIds && machingTagsIds.length
            ? '{skillstags: {anyIn: $machingTagsIds}}'
            : ''
        }
    ],
    `;

  const variables = {};
  if (search) variables.search = search;
  if (minBaseSalary) variables.minBaseSalary = minBaseSalary;
  if (maxBaseSalary) variables.maxBaseSalary = maxBaseSalary;

  if (jobTypes && jobTypes.length) variables.jobTypes = jobTypes;
  if (experienceLevels && experienceLevels.length)
    variables.experienceLevels = experienceLevels;
  if (machingTagsIds && machingTagsIds.length)
    variables.machingTagsIds = machingTagsIds;
  if (matchingCompaniesIds && matchingCompaniesIds.length)
    variables.matchingCompaniesIds = matchingCompaniesIds;

  const oneOrMoreVars = !!Object.keys(variables).length;
  const gqlvariables = oneOrMoreVars
    ? `(
        ${search ? '$search: String!' : ''}
        ${minBaseSalary ? '$minBaseSalary: FloatType' : ''}
        ${maxBaseSalary ? '$maxBaseSalary: FloatType' : ''}
    
        ${jobTypes && jobTypes.length ? '$jobTypes: [String]' : ''}
        ${
          experienceLevels && experienceLevels.length
            ? '$experienceLevels: [String]'
            : ''
        }
        ${
          matchingCompaniesIds && matchingCompaniesIds.length
            ? '$matchingCompaniesIds: [ItemId]'
            : ''
        }
        ${
          machingTagsIds && machingTagsIds.length
            ? '$machingTagsIds: [ItemId]'
            : ''
        }
        )`
    : '';

  const gqlquery = gql`
    ${JobFragment}
    query searchJobs 
       ${gqlvariables}
      {
       allJobs(
        filter: {
            ${search ? searchFilters : ''}
            ${remoteOkOnly ? ' remoteok: { eq: true } ,' : ''}
            ${featuredJobsOnly ? ' featuredjob: { eq: true } ,' : ''}  
            ${
              minBaseSalary ? 'baseannualsalary: {gte: $minBaseSalary } ,' : ''
            } 
            ${
              maxBaseSalary ? 'baseannualsalary: {lte: $maxBaseSalary } ,' : ''
            } 
            ${
              experienceLevels && experienceLevels.length
                ? 'experiencelevel: {in: $experienceLevels},'
                : ''
            }
            ${jobTypes && jobTypes.length ? 'jobtype: {in: $jobTypes},' : ''}
            ${
              machingTagsIds && machingTagsIds.length
                ? 'skillstags: {anyIn: $machingTagsIds},'
                : ''
            }
           
        }
      ) {
        ...JobFragment
        relatedjobs {
            ...JobFragment
          }
      }
    }
  `;

  const rawJobs = await client.query({ query: gqlquery, variables });
  return rawJobs;
};
