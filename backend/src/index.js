const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./src/schemas');
const { resolvers } = require('./src/resolvers');


const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/graphql`);
});