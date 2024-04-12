
import express from 'express';
import handlebars from 'express-handlebars';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import messageRouter from './routes/messageRouter.js'
import __dirname from './utils/constantsUtil.js';
import {Server} from 'socket.io';
import websocket from './websocket.js';
import mongoose from "mongoose";

const app = express();

//MongoDB conect 
const uri = "mongodb+srv://dmitri:123@cluster0.u7ei4vo.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

async function connectToMongoDB() {
    try {
        await mongoose.connect(uri);
        console.log('Conexión exitosa a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
}

// Llamar a la función para establecer la conexión
connectToMongoDB();

// const conexion = async()=>{
//     try{
//         //en este caso la conexion es a mi bbdd Mongodb local
//           await mongoose.connect("mongodb://127.0.0.1:27017", {dbName: "usuarios"})     
//         console.log("conectado a la bbdd en mongo Compas")
//     }catch(error){
//         console.log("fallo conexion")
//     }
// }


// conexion()


//Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/products', viewsRouter);
app.use('/chat', messageRouter)

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Start server http://localhost:${PORT}`);
});

const io = new Server(httpServer);

websocket(io);

