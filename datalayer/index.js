import * as contentfulJobAPI from './contentful/job';
import * as contentfulCompanyAPI from './contentful/company';

import * as datocmsJobAPI from './datocms/job';
import * as datocmsCompanyAPI from './datocms/company';

let datasource = {};
if (process.env.DATALAYER_ENGINE === 'contentful')
  datasource = { ...contentfulCompanyAPI, ...contentfulJobAPI };

if (process.env.DATALAYER_ENGINE === 'datocms')
  datasource = { ...datocmsJobAPI, ...datocmsCompanyAPI };

export default datasource;
