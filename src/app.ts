import express, { Express } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { handleError } from './middleware/errorHandlingMiddleware';
import dotenv from 'dotenv';
import cors from 'cors';
import WebSocket from 'ws';

dotenv.config();

const app: Express = express();
const wss = new WebSocket.Server({ port: parseInt(process.env.WEB_SOCKET_PORT) || 3000 });
app.use(bodyParser.json());

import authRoutes from './presentation/routes/auth.routes';
import userRoutes from './presentation/routes/user.routes';
import friendshipRoutes from './presentation/routes/friendship.routes';
import clubRoutes from './presentation/routes/club.routes';
import messageRoutes from './presentation/routes/message.routes';
import messageChunkRoutes from './presentation/routes/message.chunk.routes';
import postRoutes from './presentation/routes/post.routes';
import pollRoutes from './presentation/routes/poll.routes';
import commentRoutes from './presentation/routes/comment.routes';
import chatRoutes from './presentation/routes/chat.routes';
import clubEventRoutes from './presentation/routes/club.event.routes';
import fileRoute from './presentation/routes/file.routes';

const corsOptions = {
	//TODO: Change origin to your domain
	origin: process.env.NODE_ENV === 'production' ? process.env.ENV_DOMAIN : '*',
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
messageChunkRoutes(app);
postRoutes(app);
pollRoutes(app);
authRoutes(app);
fileRoute(app);

app.listen({ port: process.env.PORT || 8080 }, () => {
	mongoose
		.connect(process.env.DEV_CONNECTION_STRING)
		.then(() => {
			console.info('Server running, MongoDB connected');
			wss.on('connection', ws => {
				ws.on('message', message => {
					console.log(`Received message => ${message}`);
					ws.send('Message received');
				});
			});
		})
		.catch(err => {
			console.error('Failed to connect to MongoDB, retrying...', err.message);
		});
	const memoryUsage = process.memoryUsage();
	console.info(`Heap Total: ${memoryUsage.heapTotal} - Heap Used: ${memoryUsage.heapUsed}`);
});
