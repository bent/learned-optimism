const { ApolloServer, gql } = require("apollo-server")
const schema = require("./schema")
const resolvers = require("./resolvers")

const typeDefs = gql`${schema}`

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});