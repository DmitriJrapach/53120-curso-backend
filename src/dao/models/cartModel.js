import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products" // Referencia al modelo de productos
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
        default: [], // Definir como un array vacío por defecto
        _id: false
    }
});

cartSchema.plugin(mongoosePaginate);

const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;
