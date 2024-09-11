import { version } from '../../package.json';
import swaggerAutogen from 'swagger-autogen';

const doc = {
	info: {
		title: 'Social Media API',
		version,
		description: 'API for a social media application'
	},
	host: 'localhost:8080',
	tags: [
		{
			name: 'User',
			description: 'Endpoints for user interactions'
		},
		{
			name: 'Auth',
			description: 'Endpoints for user authentication'
		},
		{
			name: 'Club',
			description: 'Endpoints for club interactions'
		},
		{
			name: 'Post',
			description: 'Endpoints for post interactions'
		},
		{
			name: 'Poll',
			description: 'Endpoints for poll interactions'
		},
		{
			name: 'Comment',
			description: 'Endpoints for comment interactions'
		},
		{
			name: 'Club Event',
			description: 'Endpoints for club event interactions'
		}
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			}
		}
	},
	security: [
		{
			bearerAuth: []
		}
	]
};

const outputFile = '../../docs/swagger_output.json';
const routes = ['./../routes/*.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc).then(async () => {
	await import('./../app'); // Your project's root file
});
