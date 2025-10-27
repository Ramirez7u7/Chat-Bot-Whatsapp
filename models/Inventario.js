const mongoose = require('mongoose')



const inventarioSchema = new mongoose.Schema({
  ID: Number,
  Producto: String,
  Ubicacion: String,
  Cantidad: Number,
})

module.exports = mongoose.model('Inventario', inventarioSchema)
