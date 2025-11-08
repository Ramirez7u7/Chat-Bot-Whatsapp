const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MongoAdapter = require('@bot-whatsapp/database/mongo');
const QRPortalWeb = require('@bot-whatsapp/portal');
const connectDB = require('./db');
const Inventario = require('./models/Inventario');



connectDB();




const flowConsultar = addKeyword(['consultar', 'buscar', 'ver', 'inventario'])
  .addAnswer('¿Que material deseas buscar?', { capture: true }, async (ctx, { flowDynamic }) => {
    const material = ctx.body.trim();
    try {
      const item = await Inventario.findOne({
        Producto: { $regex: new RegExp(material, 'i') }
      });
      if (!item) {
        await flowDynamic(`No se encontró "${material}" en el inventario.`);
      } else {
        await flowDynamic(`Se cuenta con ${item.Cantidad} ${item.Producto} en la ${item.Ubicacion}.`);
      }
    } catch (error) {
      await flowDynamic('Ocurrió un error al consultar el inventario.');
    }
  });




const flowSolicitar = addKeyword(['solicitar', 'pedir'])
  .addAnswer('¿Que material deseas solicitar?', { capture: true }, async (ctx, { flowDynamic }) => {
    const solicitud = ctx.body;
    await flowDynamic(`Has solicitado: "${solicitud}". Tu solicitud sera revisada.`);
  });





const flowPrincipal = addKeyword(['hola', 'buenas', 'hey', 'saludos', 'ola', 'quiuvo', 'que tranza'])
  .addAnswer(
    'Hola, bienvenido al sistema de inventario CIDEM.\n¿Deseas *consultar* o *solicitar* un material?',
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic }) => {
      const respuesta = ctx.body.toLowerCase().trim();

      if (respuesta.includes('consultar')) {
        return gotoFlow(flowConsultar);
      } else if (respuesta.includes('solicitar')) {
        return gotoFlow(flowSolicitar);
      } else {
        await flowDynamic('No entendi tu respuesta. Por favor escribe *consultar* o *solicitar*.');
      }
    }
  );




const main = async () => {
  const adapterDB = new MongoAdapter({
    dbUri: 'mongodb://localhost:27017/CIDEM_Inventario',
    dbName: 'CIDEM_Inventario',
  });
  const adapterFlow = createFlow([flowPrincipal, flowConsultar, flowSolicitar]);
  const adapterProvider = createProvider(BaileysProvider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  QRPortalWeb();
};

main();
