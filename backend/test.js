'use strict';

const { Telnet } = require('telnet-client');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async function () {
   
  const connection = new Telnet();

  const params = {
    host: '127.0.0.1',
    port: 5000,
    shellPrompt: 'R1#',
    timeout: 1500,
    negotiationMandatory: false,
    ors: '\r\n',
    irs: '\r\n',
  };

  try {
    await connection.connect(params);

    // Send each command separately with a pause

    await connection.send('configure terminal');
    await sleep(500);

    await connection.send('interface f0/0');
    await sleep(500);

    await connection.send('ip address 192.168.1.1 255.255.255.0');
    await sleep(500);

    await connection.send('no shutdown');
    await sleep(500);

    await connection.send('exit');
    await sleep(500);

    await connection.send('end');
    await sleep(500);

    await connection.send('write memory');
    await sleep(500);

    console.log('Interface configured successfully!');
    connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
})();
