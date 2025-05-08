import React, { useState } from 'react';
import './App.css';

// Base API URL for GNS3 server

function App() {
  const [gns3Server, setGns3Server] = useState('http://localhost:3080');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [routers, setRouters] = useState([]);
  const [selectedRouter, setSelectedRouter] = useState(null);
  const [networksList, setNetworksList] = useState([]);
  const [currentNetwork, setCurrentNetwork] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // New state for interface configuration
  const [interfaces, setInterfaces] = useState([]);
  const [currentInterface, setCurrentInterface] = useState({ int: '', ip: '', mask: '' });
  // New state for PC configuration
  const [pcs, setPcs] = useState([]);
  const [selectedPc, setSelectedPc] = useState(null);
  const [pcConfig, setPcConfig] = useState({ ip: '', mask: '255.255.255.0', gateway: '' });
  // Tab state for switching between different configuration panels
  const [activeTab, setActiveTab] = useState('interfaces'); // 'interfaces', 'rip', 'pc', 'info'
  // New state for router information
  const [routerInfo, setRouterInfo] = useState({ routingTable: '', interfaceList: '' });
  
  const API_BASE = `${gns3Server}/v2`;

  const connectToGns3 = async () => {
    try {
      setIsLoading(true);
      setRouters([]);
      setSelectedRouter(null);
      setSelectedProject(null);
      
      const response = await fetch(`${API_BASE}/projects`);
      console.log('Projects API response:', response);
      
      if (response.ok) {
        setConnectionStatus('Connected');
        const projectsData = await response.json();
        console.log('Projects data:', projectsData);
        
        if (projectsData.length > 0) {
          setProjects(projectsData);
        } else {
          alert('No projects found on the GNS3 server.');
        }
      } else {
        console.error('Failed response:', response.status, response.statusText);
        setConnectionStatus('Failed to Connect');
      }
    } catch (error) {
      console.error('Error connecting to GNS3:', error);
      setConnectionStatus('Error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadNodes = async (project) => {
    setSelectedProject(project);
    setRouters([]);
    setPcs([]);
    setSelectedRouter(null);
    setSelectedPc(null);
    setActiveTab('interfaces'); // Reset to default tab
    setIsLoading(true);
    
    try {
      console.log(`Loading nodes for project: ${project.name} (${project.project_id})`);
      const nodesResponse = await fetch(`${API_BASE}/projects/${project.project_id}/nodes`);
      console.log('Nodes API response:', nodesResponse);
      
      if (nodesResponse.ok) {
        const nodes = await nodesResponse.json();
        console.log('Nodes data:', nodes);
        
        const routerNodes = nodes.filter(node => node.node_type === 'dynamips');
        const pcNodes = nodes.filter(node => node.node_type === 'vpcs');
        
        console.log('Router nodes:', routerNodes);
        console.log('PC nodes:', pcNodes);
        
        setRouters(routerNodes);
        setPcs(pcNodes);
        
        if (routerNodes.length === 0 && pcNodes.length === 0) {
          alert('No Cisco routers or VPCS found in this project.');
        }
      } else {
        console.error('Failed response:', nodesResponse.status, nodesResponse.statusText);
        alert('Failed to load nodes from the project.');
      }
    } catch (error) {
      console.error('Error loading nodes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNetwork = () => {
    if (currentNetwork && !networksList.includes(currentNetwork)) {
      setNetworksList([...networksList, currentNetwork]);
      setCurrentNetwork('');
    }
  };

  const removeNetwork = (network) => {
    setNetworksList(networksList.filter(n => n !== network));
  };

  const configureRip = async () => {
    if (!selectedRouter) {
      alert('Please select a router first.');
      return;
    }

    if (networksList.length === 0) {
      alert('Please add at least one network.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/configure-rip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodePort: selectedRouter.console,
          ripNetworks: networksList,
        }),
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
      } else {
        const errorText = await response.text();
        alert(`Failed to configure RIP: ${errorText}`);
      }
    } catch (error) {
      console.error('Error configuring RIP:', error);
      alert(`Error configuring RIP: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Add current interface to list
  const addInterface = () => {
    if (currentInterface.int && currentInterface.ip && currentInterface.mask) {
      setInterfaces([...interfaces, currentInterface]);
      setCurrentInterface({ int: '', ip: '', mask: '' });
    } else {
      alert('Please fill in all interface details');
    }
  };

  // Remove an interface from the list
  const removeInterface = (index) => {
    const updatedInterfaces = [...interfaces];
    updatedInterfaces.splice(index, 1);
    setInterfaces(updatedInterfaces);
  };

  // Handle changes to the current interface being edited
  const handleInterfaceChange = (field, value) => {
    setCurrentInterface({
      ...currentInterface,
      [field]: value
    });
  };

  // Configure router interfaces
  const configureRouterInterfaces = async () => {
    if (!selectedRouter) {
      alert('Please select a router first.');
      return;
    }

    if (interfaces.length === 0) {
      alert('Please add at least one interface.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/configure-interfaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routerPort: selectedRouter.console,
          interfaces: interfaces,
        }),
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
      } else {
        const errorText = await response.text();
        alert(`Failed to configure interfaces: ${errorText}`);
      }
    } catch (error) {
      console.error('Error configuring interfaces:', error);
      alert(`Error configuring interfaces: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle changes to PC configuration fields
  const handlePcConfigChange = (field, value) => {
    setPcConfig({
      ...pcConfig,
      [field]: value
    });
  };

  // Configure PC
  const configurePc = async () => {
    if (!selectedPc) {
      alert('Please select a PC first.');
      return;
    }

    if (!pcConfig.ip || !pcConfig.mask || !pcConfig.gateway) {
      alert('Please fill in all PC configuration details.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/configurePcs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodePort: selectedPc.console,
          ip: pcConfig.ip,
          mask: pcConfig.mask,
          gateway: pcConfig.gateway,
        }),
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
      } else {
        const errorText = await response.text();
        alert(`Failed to configure PC: ${errorText}`);
      }
    } catch (error) {
      console.error('Error configuring PC:', error);
      alert(`Error configuring PC: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get router information (routing table and interfaces)
  const getRouterInfo = async () => {
    if (!selectedRouter) {
      alert('Please select a router first.');
      return;
    }

    setIsLoading(true);
    try {
      // convert to number 
      const routerPort = Number(selectedRouter.console);
      // Get routing table
      const routingTableResponse = await fetch(`http://localhost:3001/router-info/routing-table/${routerPort}`);

      // Get interfaces
      const interfacesResponse = await fetch(`http://localhost:3001/router-info/interfaces/${routerPort}`);


      if (routingTableResponse.ok && interfacesResponse.ok) {
        const routingTable = await routingTableResponse.text();
        const interfaceList = await interfacesResponse.text();
        
        setRouterInfo({
          routingTable,
          interfaceList,
        });
        
        setActiveTab('info');
      } else {
        alert('Failed to fetch router information.');
      }
    } catch (error) {
      console.error('Error fetching router information:', error);
      alert(`Error fetching router information: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>GNS3 RIP Configurator</h1>
      <div className="connection-panel">
        <label>GNS3 Server URL:</label>
        <input
          type="text"
          value={gns3Server}
          onChange={(e) => setGns3Server(e.target.value)}
          disabled={isLoading}
        />
        <button onClick={connectToGns3} disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect'}
        </button>
        <p className={connectionStatus.toLowerCase()}>Status: {connectionStatus}</p>
      </div>

      <div className="main-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Processing, please wait...</p>
          </div>
        )}
        
        {projects.length > 0 && (
          <div className="project-list">
            <h2>Available Projects</h2>
            <ul>
              {projects.map((project) => (
                <li 
                  key={project.project_id} 
                  onClick={() => loadNodes(project)}
                  className={selectedProject && project.project_id === selectedProject.project_id ? 'selected' : ''}
                >
                  {project.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedProject && (
          <div className="router-config-container">
            <div className="node-list">
              <div className="router-section">
                <h2>Routers in {selectedProject?.name}</h2>
                <ul>
                  {routers.map((router) => (
                    <li 
                      key={router.node_id} 
                      onClick={() => {
                        setSelectedRouter(router);
                        setSelectedPc(null);
                        setActiveTab('interfaces');
                      }}
                      className={selectedRouter && router.node_id === selectedRouter.node_id ? 'selected' : ''}
                    >
                      {router.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              {pcs.length > 0 && (
                <div className="pc-section">
                  <h2>PCs in {selectedProject?.name}</h2>
                  <ul>
                    {pcs.map((pc) => (
                      <li 
                        key={pc.node_id} 
                        onClick={() => {
                          setSelectedPc(pc);
                          setSelectedRouter(null);
                          setActiveTab('pc');
                        }}
                        className={selectedPc && pc.node_id === selectedPc.node_id ? 'selected' : ''}
                      >
                        {pc.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {selectedRouter && (
              <div className="config-panel">
                <div className="tab-navigation">
                  <button 
                    className={activeTab === 'interfaces' ? 'tab-active' : ''} 
                    onClick={() => setActiveTab('interfaces')}
                  >
                    Interface Config
                  </button>
                  <button 
                    className={activeTab === 'rip' ? 'tab-active' : ''} 
                    onClick={() => setActiveTab('rip')}
                  >
                    RIP Config
                  </button>
                  <button 
                    className={activeTab === 'info' ? 'tab-active' : ''} 
                    onClick={getRouterInfo}
                  >
                    Router Info
                  </button>
                </div>

                {activeTab === 'interfaces' && (
                  <div className="interface-config">
                    <h2>Configure Interfaces for {selectedRouter.name}</h2>
                    
                    <div className="interface-input">
                      <h3>Add Interface:</h3>
                      <div className="interface-fields">
                        <div className="input-group">
                          <label>Interface:</label>
                          <input 
                            type="text" 
                            value={currentInterface.int} 
                            onChange={(e) => handleInterfaceChange('int', e.target.value)} 
                            placeholder="e.g., FastEthernet0/0" 
                          />
                        </div>
                        <div className="input-group">
                          <label>IP Address:</label>
                          <input 
                            type="text" 
                            value={currentInterface.ip} 
                            onChange={(e) => handleInterfaceChange('ip', e.target.value)} 
                            placeholder="e.g., 192.168.1.1" 
                          />
                        </div>
                        <div className="input-group">
                          <label>Subnet Mask:</label>
                          <input 
                            type="text" 
                            value={currentInterface.mask} 
                            onChange={(e) => handleInterfaceChange('mask', e.target.value)} 
                            placeholder="e.g., 255.255.255.0" 
                          />
                        </div>
                        <button onClick={addInterface}>Add Interface</button>
                      </div>
                    </div>
                    
                    {interfaces.length > 0 && (
                      <div className="interfaces-list">
                        <h3>Configured Interfaces:</h3>
                        <ul>
                          {interfaces.map((iface, index) => (
                            <li key={index} className="interface-item">
                              <div className="interface-details">
                                <span><strong>{iface.int}</strong>: {iface.ip} / {iface.mask}</span>
                              </div>
                              <button className="remove-btn" onClick={() => removeInterface(index)}>Remove</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <button className="configure-btn" onClick={configureRouterInterfaces} disabled={isLoading}>
                      {isLoading ? 'Configuring...' : 'Configure Interfaces'}
                    </button>
                  </div>
                )}

                {activeTab === 'rip' && (
                  <div className="rip-config">
                    <h2>Configure RIP for {selectedRouter.name}</h2>
                    
                    <div className="network-input">
                      <h3>Networks to advertise:</h3>
                      <div className="network-add">
                        <input 
                          type="text" 
                          value={currentNetwork} 
                          onChange={(e) => setCurrentNetwork(e.target.value)} 
                          placeholder="e.g., 192.168.1.0" 
                        />
                        <button onClick={addNetwork}>Add Network</button>
                      </div>
                    </div>
                    
                    {networksList.length > 0 && (
                      <div className="networks-list">
                        <h3>Configured Networks:</h3>
                        <ul>
                          {networksList.map((network, index) => (
                            <li key={index} className="network-item">
                              {network}
                              <button className="remove-btn" onClick={() => removeNetwork(network)}>Remove</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <button className="configure-btn" onClick={configureRip} disabled={isLoading}>
                      {isLoading ? 'Configuring...' : 'Configure RIP'}
                    </button>
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="router-info">
                    <h2>Router Information for {selectedRouter.name}</h2>
                    <div className="info-section">
                      <h3>Routing Table:</h3>
                      <pre>{routerInfo.routingTable}</pre>
                    </div>
                    <div className="info-section">
                      <h3>Interfaces:</h3>
                      <pre>{routerInfo.interfaceList}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedPc && (
              <div className="config-panel">
                <h2>Configure PC {selectedPc.name}</h2>
                
                <div className="pc-input">
                  <div className="input-group">
                    <label>IP Address:</label>
                    <input 
                      type="text" 
                      value={pcConfig.ip} 
                      onChange={(e) => handlePcConfigChange('ip', e.target.value)} 
                      placeholder="e.g., 192.168.1.10" 
                    />
                  </div>
                  <div className="input-group">
                    <label>Subnet Mask:</label>
                    <input 
                      type="text" 
                      value={pcConfig.mask} 
                      onChange={(e) => handlePcConfigChange('mask', e.target.value)} 
                      placeholder="e.g., 255.255.255.0" 
                    />
                  </div>
                  <div className="input-group">
                    <label>Default Gateway:</label>
                    <input 
                      type="text" 
                      value={pcConfig.gateway} 
                      onChange={(e) => handlePcConfigChange('gateway', e.target.value)} 
                      placeholder="e.g., 192.168.1.1" 
                    />
                  </div>
                </div>
                
                <button className="configure-btn" onClick={configurePc} disabled={isLoading}>
                  {isLoading ? 'Configuring...' : 'Configure PC'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
