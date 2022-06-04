import gql from 'graphql-tag';
import { print } from 'graphql';

import { client } from './client';
import { jobReducer, skillsReducer, tagsReducer } from './utils';

import { JobFragment } from './fragments';

export const getJobs = async () => {
  const query = gql`
    ${JobFragment}
    query {
      allJobs {
        ...JobFragment
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
  let {
    searchBarText: search,
    remoteOkOnly,
    featuredJobsOnly,
    minBaseSalary,
    maxBaseSalary,
    jobTypes,
    experienceLevels,
  } = query;

  const selectedTagsIds = []; //TODO
  const matchingCompaniesIds = []; //TODO
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
    ],
    `;

  const variables = {};
  if (search) variables.search = search;
  if (minBaseSalary) variables.minBaseSalary = minBaseSalary;
  if (maxBaseSalary) variables.maxBaseSalary = maxBaseSalary;

  if (jobTypes && jobTypes.length) variables.jobTypes = jobTypes;
  if (experienceLevels && experienceLevels.length)
    variables.experienceLevels = experienceLevels;
  if (selectedTagsIds && selectedTagsIds.length)
    variables.selectedTagsIds = selectedTagsIds;
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
          selectedTagsIds && selectedTagsIds.length
            ? '$selectedTagsIds: [ItemId]'
            : ''
        }
        ${
          matchingCompaniesIds && matchingCompaniesIds.length
            ? '$matchingCompaniesIds: [ItemId]'
            : ''
        }
        )`
    : '';

  const gqlquery = gql`
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
              selectedTagsIds && selectedTagsIds.length
                ? 'skillsTags: {in: $selectedTagsIds},'
                : ''
            }
            ${
              matchingCompaniesIds && matchingCompaniesIds.length
                ? 'company: {in: $matchingCompaniesIds},'
                : ''
            }
        }
      ) {
        title
        remoteok
      }
    }
  `;

  console.log({ gqlquery: print(gqlquery) });
  console.log({ variables });
  const rawJobs = await client.query({ query: gqlquery, variables });
  return rawJobs;
};

const _searchJobs = async (query) => {};

const _searchCompaniesButReturnJobs = async (searchBarText) => {};
