const express = require('express');
const controlCategorias = require('../controllers/categorias.controller');
const md_aut = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/validaciones');

const api = express.Router();




api.post('/registrarCategoria',[md_aut.Auth, md_roles.verAdmin] ,controlCategorias.RegistrarCategoria);
api.put('/editarCategoria/:idCat', [md_aut.Auth, md_roles.verAdmin], controlCategorias.EditarCategoria);
api.delete('/eliminarCategoria/:idCat', [md_aut.Auth, md_roles.verAdmin], controlCategorias.EliminarCategoria);
api.get('/visualizarCategorias',[md_aut.Auth, md_roles.verAdmin], controlCategorias.visualizarCategorias);

api.post('/registrarProducto',[md_aut.Auth, md_roles.verAdmin] ,controlCategorias.RegistrarProducto);
api.put('/editarProducto/:idProd', [md_aut.Auth, md_roles.verAdmin], controlCategorias.EditarProducto);
api.delete('/eliminarProducto/:idProd', [md_aut.Auth, md_roles.verAdmin], controlCategorias.EliminarProducto);
api.get('/visualizarProductos',[md_aut.Auth, md_roles.verAdmin], controlCategorias.visualizarProductos);
api.get('/verProducto/:idProd',[md_aut.Auth, md_roles.verAdmin], controlCategorias.visualizarProducto);


api.put('/editarStock/:idProd', [md_aut.Auth, md_roles.verAdmin], controlCategorias.aumentoStock);
api.get('/visualizarStock/:idProd', [md_aut.Auth, md_roles.verAdmin], controlCategorias.VisualizacionStock);
api.get('/agotadosStock', [md_aut.Auth, md_roles.verAdmin], controlCategorias.agotadosStock);




api.get('/verCategorias',md_aut.Auth , controlCategorias.verCategorias);
api.get('/verProductos',md_aut.Auth , controlCategorias.verProductos);
api.post('/verProducto',md_aut.Auth,controlCategorias.nombreProduc);
api.post('/verporCategoria',md_aut.Auth,controlCategorias.categoriaProducto);


module.exports = api;