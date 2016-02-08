var context = require.context('./', true, 
	/(app\/tests|src\/views\/tests).*\/[^\/]+\.test\.jsx$/);

context.keys().forEach(context);