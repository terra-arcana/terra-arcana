var context = require.context('./', true,
	/(app\/tests|src\/views\/tests).*\/[^\/]+\.test\.jsx$/);

window.WP_API_Settings = {
	root: 'localhost:80/wp-json'
};

context.keys().forEach(context);
