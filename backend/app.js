const express = require('express');
const bodyParser = require('body-parser');
const configurePC = require('./configurePC');
const configureInterfaces = require('./configureInterfaces');
const pingPC = require('./pingPCs');
const routerInfo = require('./routerInfo');
const { getCommandOutput } = require('./connect');
const cors = require('cors'); // Import the CORS middleware
const configureRip = require('./configureRip'); // Import the configureRip function
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
  next(); // Pass control to the next middleware
});

app.post('/configure-interfaces', async (req, res) => {
  console.log('Received data:', req.body); 
if (!req.body.routerPort || !req.body.interfaces) {
    return res.status(400).send('routerPort and interfaces are required');
  }
  const { routerPort, interfaces } = req.body; // routerPort est un nombre, interfaces est un tableau d'objets [{ int, ip, mask }]

  try {
    await configureInterfaces(routerPort, interfaces);
    res.send(`Interfaces configured successfully for router on port ${routerPort}.`);
  } catch (err) {
    console.error('Error during interface configuration:', err);
    res.status(500).send('Interface configuration failed: ' + err.message);
  }
});

app.post('/configurePcs', async (req, res) => {
  const { nodePort, ip, mask, gateway } = req.body; // nodePort est un nombre, ip, mask et gateway sont des chaînes de caractères

  try {
    await configurePC(nodePort, ip, mask, gateway);
    res.send(`PC configured successfully on port ${nodePort}.`);
  } catch (err) {
    console.error('Error during PC configuration:', err);
    res.status(500).send('PC configuration failed: ' + err.message);
  }
}
);

app.post('/configure-rip', async (req, res) => {
  const { nodePort, ripNetworks } = req.body; // nodePort est un nombre, ripNetworks est un tableau de chaînes de caractères

  try {
    await configureRip(nodePort, ripNetworks);
    res.send(`RIP configured successfully on router port ${nodePort}.`);
  } catch (err) {
    console.error('Error during RIP configuration:', err);
    res.status(500).send('RIP configuration failed: ' + err.message);
  }
}
);


app.post('/ping', async (req, res) => {
  const { sourcePC, targetIP } = req.body;

  try {
    const output = await pingPC(sourcePC, targetIP);
    res.send(output); 
  } catch (err) {
    console.error('Ping error:', err);
    res.status(500).send('Ping failed: ' + err.message);
  }
});


// Add routes for router information
app.get('/router-info/routing-table/:routerPort', async (req, res) => {
  
  const routerPort = parseInt(req.params.routerPort, 10);
  
  if (isNaN(routerPort)) {
    return res.status(400).send('Invalid router port: must be a number');
  }
  
  try {
    const routerInfo = require('./routerInfo');
    const routingTable = await routerInfo.getRoutingTable(routerPort);
    res.send(routingTable);
  } catch (err) {
    console.error('Error fetching routing table:', err);
    res.status(500).send('Failed to fetch routing table: ' + err.message);
  }
});

app.get('/router-info/interfaces/:routerPort', async (req, res) => {
  const routerPort = parseInt(req.params.routerPort, 10);
  
  if (isNaN(routerPort)) {
    return res.status(400).send('Invalid router port: must be a number');
  }
  
  try {
    const routerInfo = require('./routerInfo');
    const interfaces = await routerInfo.getInterfaces(routerPort);
    res.send(interfaces);
  } catch (err) {
    console.error('Error fetching interfaces:', err);
    res.status(500).send('Failed to fetch interfaces: ' + err.message);
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
