import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import mocks from './mocks';
import resolvers from './resolvers'

const typeDefs = `
type Adversity @model {
  id: ID! @isUnique    # read-only (managed by Graphcool)

  description: String!
  # TODO Add cascading deletes once Graphcool supports it
  beliefs: [Belief!]! @relation(name: "AdversityOnBelief")
}

type Belief @model {
  id: ID! @isUnique

  description: String!
  adversity: Adversity! @relation(name: "AdversityOnBelief")

  evidence: [Evidence!]! @relation(name: "BeliefOnEvidence")
  alternatives: [Alternative!]! @relation(name: "BeliefOnAlternative")
  implications: [Implication!]! @relation(name: "BeliefOnImplication")
}

type Evidence @model {
  id: ID! @isUnique

  description: String!
  belief: Belief! @relation(name: "BeliefOnEvidence")
}

type Alternative @model {
  id: ID! @isUnique

  description: String!
  belief: Belief! @relation(name: "BeliefOnAlternative")
}

type Implication @model {
  id: ID! @isUnique

  description: String!
  belief: Belief! @relation(name: "BeliefOnImplication")
}

type Query {
  allAdversities: [Adversity!]!
  Adversity(id: ID): Adversity!
  Belief(id: ID): Belief!
  evidencesForBelief(beliefId: ID): [Evidence!]!
  alternativesForBelief(beliefId: ID): [Alternative!]!
}

type Mutation {
  createAdversity(description: String!): Adversity
  deleteAdversity(id: ID!): Adversity
  createBelief(adversityId: ID!, description: String!): Belief
  deleteBelief(id: ID!): Belief
  createEvidence(beliefId: ID!, description: String): Evidence
  deleteEvidence(id: ID!): Evidence
  createAlternative(beliefId: ID!, description: String): Alternative
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

// addMockFunctionsToSchema({ schema, mocks });

export default schema;
