const resolvers = {
  Query: {
    allAdversities() {
      return [{ id: 1, description: 'Adversity1'}];
    }
  },
  Adversity: {
    beliefs(adversity) {
      return [{ id: 1, description: 'Belief1'}];
    }
  }
  // Author: {
  //   posts(author) {
  //     return [
  //       { id: 1, title: 'A post', text: 'Some text', views: 2 },
  //       { id: 2, title: 'Another post', text: 'Some other text', views: 200 }
  //     ];
  //   }
  // },
  // Post: {
  //   author(post) {
  //     return { id: 1, firstName: 'Hello', lastName: 'World' };
  //   }
  // }
};

export default resolvers;