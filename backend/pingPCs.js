const { connectToDevice } = require('./connect');

async function pingPC(sourcePCPort, targetIP) {
  
  const conn = await connectToDevice(sourcePCPort);
  const result = await conn.exec(`ping ${targetIP}`);
  conn.end();

  const commandLine = `${sourcePCPort}> ping ${targetIP}`;
  return `${commandLine}\n`;
}

module.exports = pingPC;
