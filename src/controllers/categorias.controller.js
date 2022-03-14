const Categoria = require('../models/categoria.model');
const Product = require('../models/producto.model');

//Acciones sobre categorias  exclusivas pal Admin

function RegistrarCategoria(req, res) {
    var parametros = req.body;
    var cat = new Categoria();

    if(parametros.nombre ) {
            cat.nombre = parametros.nombre;
            
            Categoria.find({ nombre : parametros.nombre }, (err, catEncontrado) => {
                if ( catEncontrado.length == 0 ) {

                    cat.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if(!usuarioGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar la Categoria'});
                        
                        return res.status(200).send({ usuario: usuarioGuardado });
                    });                 
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Esta categoria ya existe en la base de datos ' });
                }
            })
    }
}


function EditarCategoria(req, res) {
    var idCat = req.params.idCat;
    var parametros = req.body;
    
    Categoria.findByIdAndUpdate(idCat, parametros, { new : true } ,(err, catEditado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!catEditado) return res.status(404)
            .send({ mensaje: 'Error al editar los datos  de la  Categoria' });

        return res.status(200).send({ Categoria_Edit: catEditado});
    })

    
}


function EliminarCategoria(req, res) {
    var idCat= req.params.idCat;

    Categoria.findOne({ nombre : 'Por Defecto' }, (err, catEncontrado) => {
        if(!catEncontrado){
            const cat = new Categoria();
            cat.nombre = 'Por Defecto';
           

            cat.save((err, catGuardada)=>{
                if(err) return res.status(400).send({ mensaje: 'Error en la peticion de Guardar Categoria'});
                if(!catGuardada) return res.status(400).send({ mensaje: 'Error al guardar la Categoria'});

                Product.updateMany({ id_categoria: idCat }, { id_categoria: catGuardada._id }, 
                    (err, productEditados) => {
                        if(err) return res.status(400)
                            .send({ mensaje: 'Error en la peticion de actualizar los productos'});
                        
                        Categoria.findByIdAndDelete(idCat, (err, catEliminada)=>{
                            if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar curso"});
                            if(!catEliminada) return res.status(400).send({ mensaje: 'Error al eliminar el curso'});

                            return res.status(200).send({ 
                                editado: productEditados,
                                eliminado: catEliminada
                            })
                        })
                    })
            })

        } else {

            Product.updateMany({ id_categoria: idCat }, { id_categoria: catEncontrado._id }, 
                (err, productActualizados) => {
                    if(err) return res.status(400).send({ mensaje:"Error en la peticion de actualizar asignaciones"});

                    Categoria.findByIdAndDelete(idCat, (err, catEliminada)=>{
                        if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar la categoria"});
                        if(!catEliminada) return res.status(400).send({ mensaje: "Error al eliminar la categoria"});

                        return res.status(200).send({ 
                            editado: productActualizados,
                            eliminado: catEliminada
                        })
                    })
                })

        }
    })

   
}


function visualizarCategorias(req, res) {
    
    Categoria.find({}, (err, catEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!catEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empresa' })

        return res.status(200).send({ Categorias: catEncontrado })
    })
}




//Acciones sobre productos 
function RegistrarProducto(req, res) {
    var parametros = req.body;
    var prod = new Product();

    if(parametros.nombre&&parametros.cantidad
        &&parametros.precio&&parametros.categoria ) {

        Categoria.findOne({ nombre: parametros.categoria }, (err, catEncontrada) => {
            if (!catEncontrada) {
                return res.status(400).send({ mensaje: 'verifica el nombre de la categoria' });
            }

            prod.nombre = parametros.nombre;
            prod.cantidad = parametros.cantidad;
            prod.vendidos = '0';
            prod.precio = parametros.precio;
            prod.id_categoria = catEncontrada._id;
            
            Product.find({ nombre : parametros.nombre }, (err, catEncontrado) => {
                if ( catEncontrado.length == 0 ) {

                    prod.save((err, prodGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if(!prodGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar la Categoria'});
                        
                        return res.status(200).send({producto: prodGuardado });
                    })              
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este producto ya esta registrado en la base de datos ' });
                }
            })

        })
            
    }
}



function EditarProducto(req, res) {
    var idProd = req.params.idProd;
    var parametros = req.body;

    Categoria.findOne({ nombre: parametros.categoria }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre de la categoria' });
        }  

        Product.findByIdAndUpdate(idProd ,{id_categoria: catEncontrada._id ,parametros}, { new : true } ,(err, prodEditado)=>{

            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!prodEditado) return res.status(404)
                .send({ mensaje: 'Error al editar los datos  del Producto' });
    

            return res.status(200).send({ Producto_Edit: prodEditado});
        })
    
    })
}

function EliminarProducto(req, res) {
    var idProd= req.params.idProd;

    Product.findByIdAndDelete(idProd, (err, prductEliminada)=>{
        if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar el producto"});
        if(!prductEliminada) return res.status(400).send({ mensaje: "Error al eliminar el producto"});

        return res.status(200).send({Producto_Eliminado:prductEliminada})
    })
    
}

function visualizarProductos(req, res) {
    
    Product.find({}, (err, prodEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!prodEncontrado) return res.status(500).send({ mensaje: 'Error al buscar los productos disponibles' })

        return res.status(200).send({ Productos: prodEncontrado })
    }).populate('id_categoria','nombre')
}

function visualizarProducto(req, res) {
    const idProd = req.params.idProd;
    Product.find({_id:idProd}, (err, prodEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!prodEncontrado) return res.status(500).send({ mensaje: 'Error al buscar los productos disponibles' })

        return res.status(200).send({ Producto_Encontrado: prodEncontrado })
    }).populate('id_categoria','nombre')
}

//Control de STOCK
function aumentoStock(req, res) {
    const idProduc = req.params.idProd;
    const parametro = req.body;

    Product.findByIdAndUpdate(idProduc, {$inc:{cantidad:parametro.cantidad}}, {new:true}, (err,modifc)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!modifc) return res.status(500).send({mensaje: 'Error incrementar la cantidad del producto'});

        return res.status(200).send({ Producto_Aumentado: modifc })

    })
}

function VisualizacionStock(req, res) {
    const idProduc = req.params.idProd;
    
    Product.find({_id:idProduc},(err,modifc)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!modifc) return res.status(500).send({mensaje: 'Error incrementar la cantidad del producto'});
        return res.status(200).send({ Producto_Stock: modifc })

    }).populate('id_categoria','nombre')
}

function agotadosStock(req, res) {
    const parametro = 00;

    Product.find( {cantidad: parametro},  (err,modifc)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!modifc) return res.status(500).send({mensaje: 'Error incrementar la cantidad del producto'});

        return res.status(200).send({ Producto_Agotados: modifc })

    })
}






//Busqueda para Cliente
function nombreProduc(req, res) {
    var parametros = req.body;
   
       Product.find({ nombre: { $regex: parametros.nombre, $options: "i" } }, (err, empleadoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empleadoEncontrado) return res.status(500).send({ mensaje: 'Error al buscar el nombre del producto' });

            return res.status(200).send({ Producto: empleadoEncontrado })
        });
   
    

}

function categoriaProducto(req, res) {
    var parametros = req.body;

    Categoria.findOne({ nombre: parametros.categoria }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre de la categoria' });
        }  

        Product.find({id_categoria: catEncontrada._id ,parametros},(err, prodEditado)=>{

            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!prodEditado) return res.status(404)
                .send({ mensaje: 'Error al editar los datos  del Producto' });
    

            return res.status(200).send({ Producto_Encontrado: prodEditado});
        })
    
    })
}


function verProductos(req, res) {

    Product.find({}, (err, prodEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!prodEncontrado) return res.status(500).send({ mensaje: 'Error al buscar los productos disponibles' })
        
        return res.status(200).send({ Producto_Encontrado: prodEncontrado })
    }).populate('id_categoria','nombre')
}


function verCategorias(req, res) {
    
    Categoria.find({}, (err, catEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!catEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empresa' })

        return res.status(200).send({ Categorias: catEncontrado })
    })
}


module.exports={
RegistrarCategoria,
EditarCategoria,
EliminarCategoria,
visualizarCategorias,
verCategorias,
verProductos,
RegistrarProducto,
EditarProducto,
EliminarProducto,
visualizarProductos,
visualizarProducto,
aumentoStock,
VisualizacionStock,
nombreProduc,
categoriaProducto,
agotadosStock
}
