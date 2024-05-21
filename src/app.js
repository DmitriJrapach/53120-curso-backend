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

const app = express();

// Conexión a MongoDB
const uri = "mongodb+srv://dmitri:123@cluster0.u7ei4vo.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

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
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

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
