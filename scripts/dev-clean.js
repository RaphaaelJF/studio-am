const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORTS = [3000, 3001];

function getPidsListening(port) {
  const pids = new Set();
  try {
    const netstatOutput = execSync('netstat -ano -p tcp', { encoding: 'utf8' });
    for (const line of netstatOutput.split('\n')) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5 && parts[0] === 'TCP') {
        const localAddr = parts[1];
        const state = parts[3];
        const pid = parseInt(parts[4], 10);
        // Verifica terminação com :port (ex: :3000, [::]:3000, 0.0.0.0:3000, 127.0.0.1:3000)
        if (state === 'LISTENING' && pid && localAddr.endsWith(`:${port}`)) {
          pids.add(pid);
        }
      }
    }
  } catch (err) {}
  return Array.from(pids);
}

function killPorts() {
  console.log('[dev:clean] Verificando processos nas portas ' + PORTS.join(', ') + '...');
  
  if (process.platform === 'win32') {
    const currentPid = process.pid;
    let found = false;

    for (const port of PORTS) {
      const pids = getPidsListening(port);
      for (const pid of pids) {
        if (pid !== currentPid) {
          found = true;
          console.log(`[dev:clean] Encerrando processo conflitante PID ${pid} na porta ${port}...`);
          try {
            execSync(`taskkill /F /PID ${pid} /T`, { stdio: 'ignore' });
          } catch (e) {}
        }
      }
    }

    if (!found) {
      console.log('[dev:clean] Nenhuma porta 3000/3001 ocupada.');
    } else {
      // Aguarda 1 segundo para liberação dos sockets pelo SO
      const start = Date.now();
      while (Date.now() - start < 1000) {}
    }
  } else {
    // POSIX fallback
    for (const port of PORTS) {
      try {
        execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
      } catch (e) {}
    }
  }
}

function cleanNextDir() {
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    console.log('[dev:clean] Removendo diretório .next...');
    try {
      fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
      console.log('[dev:clean] .next removido com sucesso.');
    } catch (err) {
      console.warn('[dev:clean] Não foi possível remover .next diretamente:', err.message);
    }
  }
}

function startNext() {
  console.log('[dev:clean] Iniciando Next.js exclusivamente na porta 3000...\n');
  const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextBin, 'dev', '-p', '3000'], {
    stdio: 'inherit'
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });
}

function main() {
  killPorts();
  cleanNextDir();
  startNext();
}

main();
