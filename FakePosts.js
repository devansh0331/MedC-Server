import { faker } from '@faker-js/faker';

const generateFakePosts = (count) => {
  const fakePosts = [];
  for (let i = 0; i < count; i++) {
    const post = {
      user: faker.helpers.arrayElement(['664f9e4252492b36eb5c94cf', '6658611df1ae102dfce3d1b6', '66593ac652fcb6e5f19afdf3', '66502d9022d3c10ef958c02a', '66593cad52fcb6e5f19afdfd', '66593b2652fcb6e5f19afdf7' ]),
      audience: faker.helpers.arrayElement(['Everyone', 'Friends']),
      description: faker.lorem.paragraph(),
      fileURL: faker.image.url(),
      archived: faker.datatype.boolean(),
      likes: {}, 
    };

    fakePosts.push(post);
  }
  return fakePosts;
};

const fakePostsData = generateFakePosts(35);

export default fakePostsData;