const { Telnet } = require('telnet-client');

async function connectToDevice(port) {
  const connection = new Telnet();

  const params = {
    host: '127.0.0.1', //
    port: port,
    shellPrompt: '#',
    timeout: 60000,
    execTimeout: 60000,
    debug: true, 
    negotiationMandatory: false,
    ors: '\r\n',
    irs: '\r\n',
  };

  try {
    await connection.connect(params);
    console.log("Connected to device successfully");
    return connection;
  } catch (err) {
    console.error('Connection failed:', err);
    throw err; 
  }
}



module.exports = { connectToDevice };
