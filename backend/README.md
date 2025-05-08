# API Documentation - Configure Interfaces

## Endpoint

**URL**: `http://localhost:3000/configure-interfaces`

**Method**: `POST`

This endpoint allows you to configure interfaces for routers using an HTTP POST request. The request should include a payload containing an array of routers, where each router contains its name and a list of interfaces with their respective IP addresses and subnet masks.

---

## Request Body

The request body should be in JSON format and contain the following structure:

- `routers` (array of objects): An array of routers, where each router object contains:
  - `routerName` (string): The name of the router.
  - `interfaces` (array of objects): An array of interfaces for the router, where each interface object contains:
    - `int` (string): The interface name.
    - `ip` (string): The IP address for the interface.
    - `mask` (string): The subnet mask for the interface.

### Example Request Body:

```json
{
  "routers": [
    {
      "routerName": "R1",
      "interfaces": [
        { "int": "fa0/0", "ip": "13.13.13.1", "mask": "255.255.255.0" },
        { "int": "se0/1", "ip": "10.0.0.1", "mask": "255.255.255.252" },
        { "int": "se0/0", "ip": "192.168.5.2", "mask": "255.255.255.252" }
      ]
    },
    {
      "routerName": "R2",
      "interfaces": [
        { "int": "fa0/0", "ip": "11.11.11.1", "mask": "255.255.255.0" },
        { "int": "se0/0", "ip": "172.16.28.1", "mask": "255.255.255.252" },
        { "int": "se0/1", "ip": "10.0.0.2", "mask": "255.255.255.252" }
      ]
    },
    {
      "routerName": "R3",
      "interfaces": [
        { "int": "fa0/0", "ip": "12.12.12.1", "mask": "255.255.255.0" },
        { "int": "se0/0", "ip": "192.168.5.1", "mask": "255.255.255.252" },
        { "int": "se0/1", "ip": "172.16.28.2", "mask": "255.255.255.252" }
      ]
    }
  ]
}

```


# API Documentation - Configure PCs

## Endpoint

**URL**: `http://localhost:3000/configurePcs`

**Method**: `POST`

This endpoint allows you to configure PCs by sending a POST request to `http://localhost:3000/configurePcs`. The request should include a JSON payload with an array of PCs, where each PC object contains its name, IP address, subnet mask, and gateway IP address.

---

## Request Body

The request body should be in JSON format and contain the following structure:

- `pcs` (array of objects): An array of PCs, where each PC object contains:
  - `name` (string): The name of the PC.
  - `ip` (string): The IP address of the PC.
  - `mask` (string): The subnet mask for the PC.
  - `gateway` (string): The gateway IP address for the PC.

### Example Request Body:

```json
{
  "pcs": [
    {
      "name": "PC1",
      "ip": "12.12.12.10",
      "mask": "255.255.255.0",
      "gateway": "12.12.12.1"
    }
  ]
}
```

---

## 1. Configure Static Routes

**URL:**  
`POST http://localhost:3000/configure-ospf`

**Description:**  
This endpoint allows the user to configure **static routes** for routers.

### Request

- **Method:** POST
- **Content-Type:** application/json

### Request Body

The payload should be in JSON format and must include an array of routers, where each router contains:
- `name` (string): Router name
- `staticRoutes` (array): List of static routes, each containing:
  - `destinationNetwork` (string): The destination network address
  - `mask` (string): The subnet mask
  - `nextHop` (string): The next hop IP address

#### Example Request Body

```json
{
  "routers": [
    {
      "name": "R1",
      "staticRoutes": [
        {
          "destinationNetwork": "11.11.11.0",
          "mask": "255.255.255.0",
          "nextHop": "10.0.0.2"
        }
      ]
    }
  ]
}

```
---
# API Documentation - Configure OSPF

## Endpoint

**URL**: `http://localhost:3000/configure-ospf`

**Method**: `POST`

This endpoint allows the user to configure OSPF (Open Shortest Path First) for routers by sending a POST request to the specified URL. The request should include a JSON payload containing an array of routers, each with a list of OSPF networks to configure.

---

## Request Body

The request body should be in JSON format and contain the following structure:

- `routers` (array of objects): An array of routers, where each router object contains:
  - `name` (string): The name of the router.
  - `ospfNetworks` (array of objects): An array of OSPF networks, where each network object contains:
    - `ip` (string): The network IP address.
    - `wildcard` (string): The wildcard mask for the network.
    - `area` (string): The OSPF area for the network.

### Example Request Body:

```json
{
  "routers": [
    {
      "name": "R1",
      "ospfNetworks": [
        { "ip": "192.168.5.0", "wildcard": "0.0.0.3", "area": "0" },
        { "ip": "10.0.0.0", "wildcard": "0.0.0.3", "area": "0" },
        { "ip": "13.13.13.0", "wildcard": "0.0.0.255", "area": "0" }
      ]
    },
    {
      "name": "R2",
      "ospfNetworks": [
        { "ip": "172.16.28.0", "wildcard": "0.0.0.3", "area": "0" },
        { "ip": "10.0.0.0", "wildcard": "0.0.0.3", "area": "0" },
        { "ip": "11.11.11.0", "wildcard": "0.0.0.255", "area": "0" }
      ]
    },
    {
      "name": "R3",
      "ospfNetworks": [
        { "ip": "192.168.5.0", "wildcard": "0.0.0.3", "area": "0" },
        { "ip": "172.16.28.0", "wildcard": "0.0.0.3", "area": "0" },
        { "ip": "12.12.12.0", "wildcard": "0.0.0.255", "area": "0" }
      ]
    }
  ]
}



```


# API Documentation - Ping Endpoint

## Endpoint

**URL**: `http://localhost:3000/ping`

**Method**: `POST`

This endpoint allows you to send a ping request from a source PC to a target IP address.

---

## Request Body

The request body should be in JSON format and contain the following parameters:

- `sourcePC` (string): The name of the source PC from which the ping request will be sent.
- `targetPC` (string): The name of the target PC to which the ping request is sent.

### Example Request Body:

```json
{
  "sourcePC": "PC1",
  "targetPC": "PC2"
}
```

# API Documentation - Run Command

## Endpoint

**URL**: `http://localhost:3000/run-command`

**Method**: `POST`

This endpoint allows the user to run a specific command on a router and retrieve the response.

---

## Request Body

The request body should be in JSON format and include the following parameters:

- `routerName` (string): The name of the router where the command will be executed.
- `command` (string): The command to be executed on the router.

### Example Request Body:

```json
{
  "routerName": "R1",
  "command": "show ip interface brief"
}
```

# Network Configuration Documentation devices.js file 

This configuration file defines the setup for routers and PCs in a network. It contains the ports for each router and PC that will be used for Telnet connections.

## Configuration Overview

### Routers

The file defines three routers, each with a name and a port. These routers are used for network routing tasks and will listen on the specified ports.

| Router Name | Port  |
|-------------|-------|
| R1          | 5012  |
| R2          | 5013  |
| R3          | 5014  |

### PCs

The file defines three PCs, each with a name and a port. These PCs are used to simulate end devices on the network and will listen on the specified ports.

| PC Name | Port  |
|---------|-------|
| PC1     | 5018  |
| PC2     | 5020  |
| PC3     | 5022  |

## How to Use

This configuration file is structured as a JavaScript object that can be imported into your code. The `routers` and `pcs` arrays hold the details of the devices on the network.

### Example Usage:

```javascript
const { routers, pcs } = require('./path_to_config');

// Access router details
routers.forEach(router => {
  console.log(`Router Name: ${router.name}, Port: ${router.port}`);
});

// Access PC details
pcs.forEach(pc => {
  console.log(`PC Name: ${pc.name}, Port: ${pc.port}`);
});


