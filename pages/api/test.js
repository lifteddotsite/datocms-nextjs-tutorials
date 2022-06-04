import datasource from '../../datalayer';

export default async function handler(req, res) {
  // const data = await datasource.getCompanies();
  // const data = await datasource.getJobs();
  // const data = await datasource.getJobBySlug({
  //   slug: 'senior-software-engineer-nextjs-reactjs',
  // });
  // const data = await datasource.getCompanyBySlug({
  //   slug: 'lifted-ventures-ltd',
  // });
  // const data = await datasource.getJobsByCompanyId({
  //   id: '21945202',
  // });

  const data = await datasource.searchJobs({
    searchBarText: 'A Great job',
  });
  res.status(200).json({ data });
}
