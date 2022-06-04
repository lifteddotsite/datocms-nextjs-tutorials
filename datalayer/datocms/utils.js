import date from 'date-and-time';

export const dateReducer = (dateStr) => {
  const dateObj = date.parse(dateStr.split('T')[0], 'YYYY-MM-DD');
  return dateObj.toDateString();
};

export const richTextReducer = (rawRichtext) => {};

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
  company.slogan = rawCompany.slogan;
  company.city = rawCompany.city;
  company.website = rawCompany.website;
  company.updatedAt = rawCompany.updatedAt;
  company.logo = imageReducer(rawCompany.logo);
  company.coverImage = imageReducer(rawCompany.coverimage);
  return company;
};

export const tagsReducer = (tagsField) => {};

export const skillsReducer = (parsedTags) => {};

export const jobReducer = (rawJob, parseRelatedJobs = true) => {};
