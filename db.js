const mongoose = require('mongoose')



const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/CIDEM_Inventario', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(' Conectado a MongoDB')
  } catch (error) {
    console.error(' Error al conectar MongoDB:', error)
  }
}

module.exports = connectDB
