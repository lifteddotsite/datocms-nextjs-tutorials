import date from 'date-and-time';
import { render } from 'datocms-structured-text-to-html-string';

export const dateReducer = (dateStr) => {
  const dateObj = date.parse(dateStr.split('T')[0], 'YYYY-MM-DD');
  return dateObj.toDateString();
};

export const richTextReducer = (rawRichtext) => {
  return render(rawRichtext.value.document);
};

export const imageReducer = (imageField) => {
  return {
    url: `${imageField.url}`,
    alt: `${imageField.alt ? imageField.alt : imageField.filename}`,
    height: imageField.height,
    width: imageField.width,
    contentType: imageField.mimeType,
  };
};

export const companyReducer = (rawCompany) => {
  let company = {};
  company.id = rawCompany.id;
  company.slug = rawCompany.slug;
  company.name = rawCompany.name;

  if (rawCompany.slogan) company.slogan = rawCompany.slogan;
  if (rawCompany.city) company.city = rawCompany.city;
  if (rawCompany.website) company.website = rawCompany.website;
  company.logo = imageReducer(rawCompany.logo);
  if (rawCompany.coverimage)
    company.coverImage = imageReducer(rawCompany.coverimage);
  return company;
};

export const skillsReducer = (parsedTags) => {
  return parsedTags.map((tag) => tag.name);
};

export const jobReducer = (rawJob, parseRelatedJobs = true) => {
  const job = {};
  job.id = rawJob.id;
  job.slug = rawJob.slug;
  job.title = rawJob.title;
  job.remoteOk = rawJob.remoteok;
  job.featuredJob = rawJob.featuredjob;
  job.baseAnnualSalary = rawJob.baseannualsalary;
  job.datePosted = dateReducer(rawJob.dateposted);
  job.experienceLevel = rawJob.experiencelevel;
  job.jobType = rawJob.jobtype;
  job.jobCategory = rawJob.jobcategory;
  job.applicationLink = rawJob.applicationlink;
  job.company = companyReducer(rawJob.company);
  job.skills = skillsReducer(rawJob.skillstags);

  job.aboutYou = richTextReducer(rawJob.aboutyou);
  job.jobResponsibilities = richTextReducer(rawJob.jobresponsibilities);
  job.jobDescription = richTextReducer(rawJob.jobdescription);
  job.remunerationPackage = richTextReducer(rawJob.remunerationpackage);

  const relatedJobs = rawJob.relatedjobs || [];

  if (!parseRelatedJobs) {
    job.relatedJobs = [];
  } else {
    job.relatedJobs = relatedJobs.map((relatedJob) => {
      return jobReducer(relatedJob, false);
    });
  }

  return job;
};
