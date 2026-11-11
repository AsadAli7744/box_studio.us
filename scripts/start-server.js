const net = require('net');
const { spawn } = require('child_process');

const mode = process.argv[2] === 'start' ? 'start' : 'dev';
const preferredPort = parseInt(process.env.PORT || '3000', 10);

function isPortFree(port) {
  return new Promise((resolve) => {
    const server4 = net.createServer();
    server4.once('error', () => resolve(false));
    server4.once('listening', () => {
      server4.close(() => {
        const server6 = net.createServer();
        server6.once('error', () => resolve(false));
        server6.once('listening', () => server6.close(() => resolve(true)));
        server6.listen(port, '::');
      });
    });
    server4.listen(port, '0.0.0.0');
  });
}

async function getAvailablePort(startPort) {
  let port = startPort;
  while (!(await isPortFree(port))) {
    port++;
  }
  return port;
}

async function main() {
  const availablePort = await getAvailablePort(preferredPort);
  if (availablePort !== preferredPort) {
    console.log(`Port ${preferredPort} is already in use. Automatically switching to available port: ${availablePort}\n`);
  }

  const isWindows = process.platform === 'win32';
  const nextCmd = isWindows ? 'npx.cmd' : 'npx';
  const child = spawn(nextCmd, ['next', mode, '-p', String(availablePort)], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

main();
