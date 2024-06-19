import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import messageRouter from './routes/messageRouter.js';
import __dirname from './utils/constantsUtil.js';
import { Server } from 'socket.io';
import websocket from './websocket.js';
import mongoose from "mongoose";
import passport from 'passport';
import cookieParser from 'cookie-parser';
import initializePassport from './config/passportConfig.js';
import dotenv from 'dotenv';
import { create } from 'express-handlebars';
import compression from 'express-compression';
import errors from './middleware/errors/index.js';
import { addLogger, startLogger } from './utils/loggerUtil.js';

dotenv.config();

const app = express();

// Conexión a MongoDB
const uri = process.env.URI;

async function connectToMongoDB() {
    try {
        await mongoose.connect(uri);
        console.log('Conexión exitosa a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
}

connectToMongoDB();

// Configuración de Handlebars
const hbs = create({
    helpers: {
        eq: (a, b) => a === b
    }
});


// Configuración de Handlebars
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(compression());
app.use(errors);

// Middleware de sesión
app.use(session({
    store: mongoStore.create({
        mongoUrl: uri,
        ttl: 3600
    }),
    secret: 'secretPhrase',
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.use(addLogger);

// Routers
app.use('/api/sessions', userRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/chat', messageRouter);
app.use('/', viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Start server http://localhost:${PORT}`);
});

const io = new Server(httpServer);

websocket(io);
