const express = require('express');
const controlCarrito = require('../controllers/carrito.controller');
const md_aut = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/validaciones');

const api = express.Router();



//api.get('/verCategorias',md_aut.Auth , controlCategorias.verCategorias);
//api.get('/verProductos',md_aut.Auth , controlCategorias.verProductos);
//api.post('/verProducto',md_aut.Auth,controlCategorias.nombreProduc);

api.post('/agregarCarrito',[md_aut.Auth,md_roles.verCliente],controlCarrito.Carrito);
api.get('/verCarrito',[md_aut.Auth,md_roles.verCliente], controlCarrito.visualizarCarrito);
api.put('/eliminarCarrito',[md_aut.Auth,md_roles.verCliente], controlCarrito.eliminarCarrito);
api.post('/agregarFactura',[md_aut.Auth,md_roles.verCliente],controlCarrito.RegistrarFactura);
api.put('/obtenerFactura',[md_aut.Auth,md_roles.verCliente], controlCarrito.agregarFactu);
api.get('/verFacturas',[md_aut.Auth,md_roles.verCliente], controlCarrito.visualizarFatura);
api.get('/obtenerFacturaTotal',[md_aut.Auth,md_roles.verCliente], controlCarrito.obtenerFactu);


api.get('/visualizarFacturas',[md_aut.Auth,md_roles.verAdmin], controlCarrito.visualizarFatura);
api.post('/verFacturaCliente',[md_aut.Auth,md_roles.verAdmin],controlCarrito.nombreFactura);

module.exports = api;