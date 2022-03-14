const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const CatRutas = require('./src/routes/categorias.routes');
const CarRutas = require('./src/routes/carrito.routes');

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());


// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuarioRutas,CatRutas,CarRutas);


module.exports = app;