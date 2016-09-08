import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if (Meteor.isClient) {
  checkNpmVersions({
    'apollo-client': '^0.4.11'
  }, 'apollo-passport');
} else {
  checkNpmVersions({
    'apollo-server': '^0.2.1',
    'apollo-passport': '^0.0.5',
    'apollo-passport-mongodb': '^0.0.1',
    "body-parser": "^1.15.2",
    "express": "^4.14.0",
    "graphql": "^0.6.2",
    "graphql-tools": "^0.6.2",
    'regenerator-runtime': '^0.9.5',
  }, 'apollo');
}
