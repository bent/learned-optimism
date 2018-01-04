 import { Adversity, Belief, Evidence, Alternative, Implication } from './connectors'

const resolvers = {
  Query: {
    allAdversities(_, args) {
      return Adversity.findAll();
    },
    Adversity(_, args) {
      return Adversity.findById(args.id)
    },
    Belief(_, {id}) {
      return Belief.findById(id)
    },
    evidencesForBelief(_, {beliefId}) {
      return Evidence.findAll({where: {beliefId}})
    },
    alternativesForBelief(_, {beliefId}) {
      return Alternative.findAll({where: {beliefId}})
    },
    implicationsForBelief(_, {beliefId}) {
      return Implication.findAll({where: {beliefId}})
    }
  },
  Adversity: {
    beliefs(author) {
      return author.getBeliefs();
    }
  },
  Belief: {
    adversity(belief) {
      return belief.getAdversity()
    }
  },
  Mutation: {
    createAdversity(_, {description}) {
      return Adversity.create({description})
    },
    deleteAdversity(_, {id}) {
      return Adversity.destroy({where: {id}}).then(() => {id})
    },
    createBelief(_, {adversityId, description}) {
      return Belief.create({adversityId, description})
    },
    deleteBelief(_, {id}) {
      return Belief.destroy({where: {id}}).then(() => {id})
    },
    createEvidence(_, {beliefId, description}) {
      return Evidence.create({beliefId, description})
    },
    deleteEvidence(_, {id}) {
      return Evidence.destroy({where: {id}}).then(() => {id})
    },
    createAlternative(_, {beliefId, description}) {
      return Alternative.create({beliefId, description})
    },
    deleteAlternative(_, {id}) {
      return Alternative.destroy({where: {id}}).then(() => {id})
    },
    createImplication(_, {beliefId, description}) {
      return Implication.create({beliefId, description})
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