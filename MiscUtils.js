const net = require('net');

const pingIP = (ips, port) => {
  ips.forEach((ip) => {
    const sock = new net.Socket();
    sock.setTimeout(2500);
    sock
      .on('connect', () => {
        console.log(`${ip}:${port} is up.`);
        sock.destroy();
      })
      .on('error', (e) => {
        console.log(`${ip}:${port} is down: ${e.message}`);
        sock.destroy();
      })
      .on('timeout', () => {
        console.log(`${ip}:${port} is down: timeout`);
        sock.destroy();
      })
      .connect(port, ip);
  });
};

module.exports = { pingIP };
