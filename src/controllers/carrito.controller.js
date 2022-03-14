const Usuario = require('../models/usuario.model');
const Factu = require('../models/factura.model');
const Product = require('../models/producto.model');



// Agregar PRODUCTOS A CARRITO
function Carrito(req, res){
    var logeado = req.user;
    var parametros = req.body;
    
   
    Product.findOne({ nombre : parametros.producto }, (err, prodEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion producto'});
        if(!prodEncontrado) return res.status(500).send({ mensaje: 'Verifique el nombre del producto'});

        Usuario.countDocuments({_id:logeado.sub, "carrito.producto":parametros.producto},(err,registrado)=>{
            if(registrado==0){
                if(prodEncontrado.cantidad < parametros.cantidad){
                    return res.status(500).send({ mensaje: 'La cantidad que desea comprar sobrepasa la cantidad existente'})
                }
                Usuario.findByIdAndUpdate(logeado.sub, { $push: { carrito: { producto:parametros.producto, 
                    cantidadComp:parametros.cantidad, precioUnidad:prodEncontrado.precio, subtotal:parametros.cantidad*prodEncontrado.precio } } }, {new : true},
                    (err, carritoAgregado)=>{
                        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion del carrito'})
                        if(!carritoAgregado) return res.status(500).send({ mensaje: 'Error al agregar el producto al carrito'});
            
                        let totalLocal = 0;
                        for(let i = 0; i < carritoAgregado.carrito.length; i++){
                            totalLocal += carritoAgregado.carrito[i].subtotal;
                        }
            
                        Usuario.findByIdAndUpdate(logeado.sub, { totalCarrito: totalLocal }, {new : true},
                            (err, carritoAgregado)=>{
                                if(err) return res.status(500).send({ mensaje: 'Error en  la peticion total Carrito'});
                                if(!carritoAgregado) return res.status(500).send({ mensaje: 'Error al actualizar el total del carrito'});
            
                                return res.status(200).send({ Agregado_Carrito:  carritoAgregado})
                            })
                    })

            }else{
                return res.status(200).send({ mensaje:  "Este producto ya esta agregado en el carrito, eliminelo si desea cambiar la cantidad comprada"})
            }

        })
        
        
        
       
    })
 
 }



 function eliminarCarrito(req, res){
    var logeado = req.user;
    var parametros = req.body;
    
    Usuario.findOne({_id:logeado.sub, "carrito.producto": parametros.producto},( err,carritoEncotrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion del carrito'})
        if(carritoEncotrado !== 00){
            Usuario.findOneAndUpdate({_id:logeado.sub, carrito : { $elemMatch : {producto:parametros.producto } } }, 
                { $pull : { carrito : { producto:parametros.producto} } }, {new : true}, (err, prodEliminado)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                    if(!prodEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el producto del carrito'});
                    
                    let totalLocal = 0;
                    for(let i = 0; i < prodEliminado.carrito.length; i++){
                        totalLocal += prodEliminado.carrito[i].subtotal;
                    }
        
                    Usuario.findByIdAndUpdate(logeado.sub, { totalCarrito: totalLocal }, {new : true}, (err, carritoAgregado)=>{
                            if(err) return res.status(500).send({ mensaje: 'Error en  la peticion del Carrito'});
                            if(!carritoAgregado) return res.status(500).send({ mensaje: 'Error al actualizar el total del carrito'});
        
                            return res.status(200).send({ Eliminado_Carrito:  carritoAgregado})
                        })
                    
                })

        }})

    
}



 //Ver su carrito
 function visualizarCarrito(req, res) {
    var logeado = req.user;
    Usuario.findById(logeado.sub , (err, prodEncontrados)=>{
        let tabla = []
        for(let i = 0; i < prodEncontrados.carrito.length; i++){
            // tabla.push(usuarioEncontrado.carrito[i].nombreProducto + ' ' + usuarioEncontrado.carrito[i].precioUnitario)
            tabla.push(`producto: ${prodEncontrados.carrito[i].producto} cantidad:${ prodEncontrados.carrito[i].cantidadComp}  precio: Q.${prodEncontrados.carrito[i].precioUnidad}.00  subtotal: Q.${prodEncontrados.carrito[i].subtotal}.00`)
            
        }
        let Total = []
    
            Total.push(`total: Q.${prodEncontrados.totalCarrito}.00`)
            
        

        return res.status(200).send({Carrito: tabla, Total})


    })
    
}



//Creacion de Factura
function RegistrarFactura(req, res) {
    var parametros = req.body;
    var logeado = req.user;
    var prod = new Factu();

    if(parametros.nit) {
            prod.nit = parametros.nit;
            prod.idUsuario = logeado.sub;

            prod.save((err, prodGuardado) => {
                if (err) return res.status(500)
                    .send({ mensaje: 'Error en la peticion AgregFactu' });
                if(!prodGuardado) return res.status(500)
                    .send({ mensaje: 'Error al agregar la Factura'});
                          
            }) 
        
       
            
    }

    
}

function agregarFactu(req, res) {   
    var logeado = req.user;

    Usuario.findById(logeado.sub, (err, logeadoEncontrado) => {
        if (err) return res.status(500).send({ message: 'error en la petición de usuarios' })
        if (!logeadoEncontrado) return res.status(404).send({ message: 'error al listar los usuarios' })

        for (let i = 0; i < logeadoEncontrado.carrito.length; i++) {
            var listado = logeadoEncontrado.carrito[i]
            var compardo = listado.cantidadComp
           Product.findOne({nombre:listado.producto},(err,prodEmcont)=>{
               if(err) return res.status(200).send({mensaje:"no se aqui paso algo"});
            Product.updateOne({ _id: prodEmcont._id }, { $inc: { cantidad: -compardo } }).exec();
            Product.updateOne({ _id: prodEmcont._id }, {push: { $inc: { vendidos: compardo } }}).exec();
           })
           
           Factu.findOne({idUsuario:logeado.sub},(err,factEcont)=>{
            Factu.findByIdAndUpdate(factEcont._id, { $push:  { listaProductos: { nombreProducto : listado.producto,
            cantidadComprada : listado.cantidadComp, preciUnitario:listado.precioUnidad, subtotal:listado.subtotal } } }, (err, facturaActualizada) => {
                if (err) return res.status(500).send({ message: 'error en la petición' })
                if (!facturaActualizada) return res.status(404).send({ message: 'error al actualizar' })
                 return res.status(200).send({Factura:facturaActualizada})
            })

           })

           
        }

        
    })
}

function visualizarFatura(req, res) {
    const logeado = req.user;
    Factu.find({idUser:logeado.sub}, (err, prodEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!prodEncontrado) return res.status(500).send({ mensaje: 'Error al buscar los productos disponibles' })

        return res.status(200).send({ Facturas: prodEncontrado })
    }).populate('idUsuario','nombre , apellido')
}

function obtenerFactu(req, res) {
    var logeado = req.user;

    Usuario.find(logeado.sub, (err,user)=>{
        Factu.findOne({idUsuario:logeado.sub} , (err, prodEncontrados)=>{
            let Factura = []
            for(let i = 0; i < prodEncontrados.listaProductos.length; i++){
                // tabla.push(usuarioEncontrado.carrito[i].nombreProducto + ' ' + usuarioEncontrado.carrito[i].precioUnitario)
                 Factura.push(`producto: ${prodEncontrados.listaProductos[i].nombreProducto} cantidad:${ prodEncontrados.listaProductos[i].cantidadComprada}  precio: Q.${prodEncontrados.listaProductos[i].precioUnitario}.00  subtotal: Q.${prodEncontrados.listaProductos[i].subtotal}.00`)
                
            }
            let Total = []
        
                Total.push(`total: Q.${prodEncontrados.totalFactura}.00`)
                
            
    
            return res.status(200).send({Carrito: Factura, Total})
    
    
        })

    })
   
    
}







//ADMIN Y FACTURAS
function visualizarFacturas(req, res) {
    
    Factu.find({}, (err, prodEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!prodEncontrado) return res.status(500).send({ mensaje: 'Error al buscar los productos disponibles' })

        return res.status(200).send({ Facturas: prodEncontrado })
    }).populate('idUsuario','nombre')
}

function nombreFactura(req, res) {
    var parametros = req.body;
   
      
    Usuario.findOne({nombre: parametros.cliente }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre del cliente' });
        }  

        Factu.find({idUsuario: catEncontrada._id,parametros },(err, prodEditado)=>{

            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!prodEditado) return res.status(404)
                .send({ mensaje: 'Error al obtener las facturas del Cliente' });
    

            return res.status(200).send({ Factura_Encontrada: prodEditado});
        })
    
    })
   
    

}






module.exports={
   Carrito,
   visualizarCarrito,
   eliminarCarrito,
   RegistrarFactura,
   agregarFactu,
   visualizarFacturas,
   visualizarFatura,
   nombreFactura,
   obtenerFactu

    
}