const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre:String,
    apellido:String,
    usuario:String,
    email:String,
    password:String,
    rol:String,
    carrito: [{
        producto: String,
        cantidadComp: Number,
        precioUnidad: Number,
        subtotal:Number
    }],
    totalCarrito: Number
});

module.exports = mongoose.model('Usuarios',UsuarioSchema);
