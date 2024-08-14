import { faker } from '@faker-js/faker';

const generateFakeJobs = (count) => {
  const fakeJobs = [];
  for (let i = 0; i < count; i++) {
    const job = {
      jobTitle: faker.name.jobTitle(),
      organizationName: faker.company.name(),
      location: faker.address.city(),
      salaryRange: `₹${faker.datatype.number({ min: 300000, max: 1500000 })}-${faker.datatype.number({ min: 500000, max: 2000000 })} per year`,
      requiredQualification: faker.education?.degree(),
      benefits: `${faker.lorem.words(3)}, ${faker.lorem.words(3)}, ${faker.lorem.words(3)}`,
      skills: `${faker.lorem.words(3)}, ${faker.lorem.words(3)}, ${faker.lorem.words(3)}`,
      experience: `${faker.datatype.number({ min: 0, max: 5 })} years`,
      workTiming: `${faker.datatype.number({ min: 9, max: 11 })} AM - ${faker.datatype.number({ min: 5, max: 7 })} PM`,
      jobType: faker.helpers.arrayElement(['Full-time', 'Part-time', 'Contract']),
      jobDescription: faker.lorem.paragraph(),
    };
    fakeJobs.push(job);
  }
  return fakeJobs;
};

const fakeJobsData = generateFakeJobs(20);

export default fakeJobsData;
