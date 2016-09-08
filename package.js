Package.describe({
  name: 'apollo-passport',
  version: '0.0.1-pre.0',
  summary: ' 🚀 Add Apollo Passport to your Meteor app',
  git: 'https://github.com/apollo-passport/meteor-apollo-passport'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.0.1');
  api.use(['ecmascript',
           'underscore',
           'tmeasday:check-npm-versions@0.3.1']);

  api.mainModule('main-client.js', 'client');
  api.mainModule('main-server.js', 'server');
});

Package.onTest(function(api) {
  api.use(['ecmascript',
           'practicalmeteor:mocha',
           'practicalmeteor:chai',
           'apollo']);

  api.mainModule('tests/client.js', 'client');
  api.mainModule('tests/server.js', 'server');
});
