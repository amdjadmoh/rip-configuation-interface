const {connectToDevice} = require('./connect');

exports.getRoutingTable = async (routerPort) => {
    const conn = await connectToDevice(routerPort);
    const result = await conn.exec('show ip route');
    conn.end();
    
    const commandLine = `show ip route`;
    return `${commandLine}\n${result}`;
    }
exports.getInterfaces = async (routerPort) => {
    const conn = await connectToDevice(routerPort);
    const result = await conn.exec('show ip interface brief');
    conn.end();
    
    const commandLine = `show ip interface brief`;
    return `${commandLine}\n${result}`;
}





