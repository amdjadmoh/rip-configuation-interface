const { connectToDevice } = require('./connect');

async function pingPC(sourcePCPort, targetIP) {
  try {
    const conn = await connectToDevice(sourcePCPort);

    const result = await conn.exec(`ping ${targetIP} -c 1`); // Sending one ping packet
    conn.end();
    // Format the command and result for return
    const commandLine = `${sourcePCPort}> ping ${targetIP}`;
    return `${commandLine}\n${result}`;
  } catch (error) {
    console.error('Error during ping execution:', error);
    throw new Error('Failed to execute ping command.');
  }
}

module.exports = pingPC;