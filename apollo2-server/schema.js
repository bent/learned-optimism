module.exports = `
  type Adversity {
    id: ID!

    description: String!
    beliefs: [Belief!]!
  }

  type Belief {
    id: ID!

    description: String!
    adversity: Adversity!

    evidence: [Evidence!]!
    alternatives: [Alternative!]!
    implications: [Implication!]!
  }

  type Evidence {
    id: ID!

    description: String!
    belief: Belief!
  }

  type Alternative {
    id: ID!

    description: String!
    belief: Belief!
  }

  type Implication {
    id: ID!

    description: String!
    belief: Belief!
  }

  type Query {
    getAllAdversities: [Adversity!]!
    getAdversity(id: ID): Adversity!
    getBelief(id: ID): Belief!
    evidencesForBelief(beliefId: ID): [Evidence!]!
    alternativesForBelief(beliefId: ID): [Alternative!]!
    implicationsForBelief(beliefId: ID): [Implication!]!
  }

  type Mutation {
    createAdversity(description: String!): Adversity
    deleteAdversity(id: ID!): Adversity
    createBelief(adversityId: ID!, description: String!): Belief
    deleteBelief(id: ID!): Belief
    createEvidence(beliefId: ID!, description: String): Evidence
    deleteEvidence(id: ID!): Evidence
    createAlternative(beliefId: ID!, description: String): Alternative
    deleteAlternative(id: ID!): Alternative
    createImplication(beliefId: ID!, description: String): Implication
    deleteImplication(id: ID!): Implication
  }
`