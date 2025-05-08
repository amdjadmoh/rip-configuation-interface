const { connectToDevice } = require('./connect');

async function configureInterfaces(routerPort, interfaces) {

  const conn = await connectToDevice(routerPort);
  
  try {
    await conn.exec('configure terminal');
  
    for (const iface of interfaces) {
      await conn.exec(`interface ${iface.int}`);
      await conn.exec(`ip address ${iface.ip} ${iface.mask}`);
      await conn.exec('no shutdown');
      await conn.exec('exit');
    }
  
    await conn.exec('end');
    await conn.exec('write memory');
  } catch (err) {
    console.error(`Error configuring interfaces for router `, err);
    throw err; 
  } finally {
    conn.end(); 
  }
}

module.exports = configureInterfaces;
