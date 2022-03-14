const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSchema = Schema({
    nombre:String,
    
});

module.exports = mongoose.model('Categorias',CategoriaSchema);
