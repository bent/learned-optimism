 const { Adversity, Belief, Evidence, Alternative, Implication } = require("./connectors")

const resolvers = {
  Query: {
    getAllAdversities() {
      return Adversity.findAll();
    },
    getAdversity(_, args) {
      return Adversity.findById(args.id)
    },
    getBelief(_, {id}) {
      return Belief.findById(id)
    },
    getEvidenceForBelief(_, {beliefId}) {
      return Evidence.findAll({where: {beliefId}})
    },
    getAlternativesForBelief(_, {beliefId}) {
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
    },
    deleteImplication(_, {id}) {
      return Implication.destroy({where: {id}}).then(() => {id})
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

module.exports = resolvers;