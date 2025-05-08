const { connectToDevice } = require('./connect');

async function configureRip(nodePort, ripNetworks) {

  const conn = await connectToDevice(nodePort);  

  try {
    await conn.exec('configure terminal');
    await conn.exec('router rip');
    await conn.exec('version 2');
    await conn.exec('no auto-summary');

    
    for (const net of ripNetworks) {
      await conn.exec(`network ${net}`);
      console.log(`donde network ${net}`)
    }

    await conn.exec('end');
    await conn.exec('write memory');
  } catch (err) {
    console.error(`Error configuring rip for router :`, err);
    throw err;
  } finally {
    conn.end(); 
  }
}

module.exports = configureRip;
