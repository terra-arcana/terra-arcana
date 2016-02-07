var context = require.context('./app/tests', true, /.jsx$/);

context.keys().forEach(context);