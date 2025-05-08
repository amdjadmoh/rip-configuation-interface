const { connectToDevice } = require('./connect');


async function configurePC(nodePort, ip, mask, gateway) {

  const conn = await connectToDevice(nodePort);  
  await conn.exec(`ip ${ip} ${mask} ${gateway}`);
  await conn.exec(`save`);
  conn.end();  
}

module.exports = configurePC;
