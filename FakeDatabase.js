import { faker } from '@faker-js/faker';

const generateFakeJobs = (count) => {
  const fakeJobs = [];
  for (let i = 0; i < count; i++) {
    const job = {
      jobTitle: faker.person.jobTitle(), // Using faker.name.jobTitle() for more specific job titles
      organizationName: faker.company.name(),
      location: faker.location.city(), // Using faker.address.city() for a more complete location
      salaryRange: `₹${faker.number.int({ min: 300000, max: 1500000 })}-${faker.number.int({ min: 500000, max: 2000000 })} per year`,
      requiredQualification: faker.education?.degree(),
      benefits: `${faker.lorem.words(3)}. ${faker.lorem.words(3)}. ${faker.lorem.words(3)}`, // Improved readability with periods
      skills: `${faker.lorem.words(3)}. ${faker.lorem.words(3)}. ${faker.lorem.words(3)}`, // Improved readability with periods
      experience: `${faker.number.int({ min: 0, max: 5 })} years`,
      workTiming: `${faker.number.int({ min: 9, max: 11 })} AM - ${faker.number.int({ min: 5, max: 7 })} PM`, // `faker.datatype.number` is still acceptable for work hours
      jobType: faker.helpers.arrayElement(['Full-time', 'Part-time', 'Contract']),
      jobDescription: faker.lorem.paragraph(),
    };
    fakeJobs.push(job);
  }
  return fakeJobs;
};

const fakeJobsData = generateFakeJobs(20);

export default fakeJobsData;