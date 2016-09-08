import './check-npm.js';

import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import bodyParser from 'body-parser';
import express from 'express';

import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { MongoInternals } from 'meteor/mongo';

import ApolloPassport from 'apollo-passport';
import MongoDBDriver from 'apollo-passport-mongodb';
import { mergeResolvers, mergeSchemas } from 'apollo-passport/lib/utils/graphql-merge';

const defaultApolloPassportConfig = {
  db: new MongoDBDriver(MongoInternals.defaultRemoteCollectionDriver().mongo.db)
};

export const createApolloPassport = (givenConfig) => {
  let config = _.extend({}, defaultApolloPassportConfig, givenConfig);
  return new ApolloPassport(config);
};

const defaultApolloConfig = {
  path: '/graphql',
  maxAccountsCacheSizeInMB: 1,
  graphiql : Meteor.isDevelopment,
  graphiqlPath : '/graphiql',
  graphiqlOptions : {}
};

export const createApolloServer = (givenOptions, givenConfig) => {

  const config = _.extend({}, defaultApolloConfig, givenConfig);
  const ap = config.apolloPassport;

  const graphQLServer = express();

  const executableSchema = makeExecutableSchema({
    typeDefs: mergeSchemas(givenOptions.schema.concat(ap.schema())),
    resolvers: mergeResolvers(givenOptions.resolvers, ap.resolvers()),
    connectors: givenOptions.connectors,
  });

  if (givenOptions.mocks) {
    addMockFunctionsToSchema({
      schema: executableSchema,
      mocks: givenOptions.mocks,
      preserveResolvers: true,
    });
  }

  const options = { schema: executableSchema };

  // GraphQL endpoint
  graphQLServer.use(config.path,
    bodyParser.json(),
    apolloExpress(ap.wrapOptions(options))
  );

  // Start GraphiQL if enabled
  if (config.graphiql) {
    graphQLServer.use(config.graphiqlPath, graphiqlExpress(_.extend(config.graphiqlOptions, {endpointURL : config.path})));
  }

  // This binds the specified paths to the Express server running Apollo + GraphiQL
  WebApp.connectHandlers.use(Meteor.bindEnvironment(graphQLServer));

  WebApp.connectHandlers.use('/ap-auth', ap.expressMiddleware());
};
