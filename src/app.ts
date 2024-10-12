import express, { Express } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { handleError } from './middleware/errorHandlingMiddleware';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import friendshipRoutes from './routes/friendshipRoutes';
import clubRoutes from './routes/clubRoutes';
import messageRoutes from './routes/messageRoutes';
import postRoutes from './routes/postRoutes';
import pollRoutes from './routes/pollRoutes';
import commentRoutes from './routes/commentRoutes';
import chatRoutes from './routes/chatRoutes';
import clubEventRoutes from './routes/clubEventRoutes';
import fileRoute from './routes/fileRoute';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());

const corsOptions = {
	//TODO: Change origin to your domain
	origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*',
	methods: 'GET, POST, PUT, PATCH, DELETE',
	allowedHeaders: 'Content-Type, Authorization',
};

app.use(handleError);
app.use(cors(corsOptions));

userRoutes(app);
friendshipRoutes(app);
chatRoutes(app);
clubRoutes(app);
clubEventRoutes(app);
commentRoutes(app);
messageRoutes(app);
postRoutes(app);
pollRoutes(app);
authRoutes(app);
fileRoute(app);

app.listen({ port: process.env.PORT || 8080 }, () => {
	mongoose
		.connect(process.env.MONGO_URL)
		.then(() => {
			console.log('Server running, MongoDB connected');
		})
		.catch(err => {
			console.error('Failed to connect to MongoDB, retrying...', err.message);
		});
	const memoryUsage = process.memoryUsage();
	console.log(`Heap Total: ${memoryUsage.heapTotal} - Heap Used: ${memoryUsage.heapUsed}`);
});
