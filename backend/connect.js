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

async function getCommandOutput(port, command) {
  const conn = await connectToDevice(port);  

  try {
   
    await conn.send("\r");
    
    
    await new Promise(resolve => setTimeout(resolve, 2000));  

    
    const output = await conn.exec(command, { execTimeout: 30000 });

    conn.end();  

    return output; 
  } catch (err) {
    console.error('Error executing command:', err);  
    conn.end();  
    throw err;  
  }
}

module.exports = { connectToDevice, getCommandOutput };
