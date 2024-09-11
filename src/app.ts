import express, { Express } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import { handleError } from './middleware/errorHandlingMiddleware';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import friendshipRoutes from './routes/friendshipRoutes';
import clubRoutes from './routes/clubRoutes';
import postRoutes from './routes/postRoutes';
import pollRoutes from './routes/pollRoutes';
import commentRoutes from './routes/commentRoutes';
import clubEventRoutes from './routes/clubEventRoutes';
import fileRoute from './routes/fileRoute';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './../docs/swagger_output.json';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

fs.mkdirSync(path.join(__dirname, '../media/images'), { recursive: true });
fs.mkdirSync(path.join(__dirname, '../media/videos'), { recursive: true });
fs.mkdirSync(path.join(__dirname, '../media/profilePhotos'), { recursive: true });

const app: Express = express();

app.use(bodyParser.json());

app.use('/media', express.static(path.join(__dirname, '/media')));

const corsOptions = {
	//TODO: Change origin to your domain
	origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*',
	methods: 'GET, POST, PUT, PATCH, DELETE',
	allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));

userRoutes(app);
friendshipRoutes(app);
commentRoutes(app);
clubRoutes(app);
clubEventRoutes(app);
postRoutes(app);
pollRoutes(app);
authRoutes(app);
fileRoute(app);

const retryMongoDBConnect = () => {
	mongoose
		.connect(process.env.MONGO_URL)
		.then(() => {
			app.listen({ port: 8080 }, () => {
				console.log('Server running, MongoDB connected');
				app.use(handleError);
				app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
			});
		})
		.catch(err => {
			console.error('Failed to connect to MongoDB, retrying...', err);
			setTimeout(retryMongoDBConnect, 5000); // Retry connection every 5 seconds
		});
};

retryMongoDBConnect();
