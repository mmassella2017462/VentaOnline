const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = Schema({
    id_categoria: { type: Schema.Types.ObjectId, ref: 'Categorias'},
    nombre: String,
    cantidad: Number,
    vendidos: Number,
    precio: Number

});



module.exports = mongoose.model('Productos',ProductoSchema);










