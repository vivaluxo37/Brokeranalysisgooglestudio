#!/usr/bin/env node

/**
 * Development Port Selector Script
 * Interactive script to choose and start the appropriate development environment
 */

const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const developmentOptions = [
  {
    name: 'Standard Development (Port 3000)',
    port: 3000,
    command: 'npm run dev',
    description: 'Full-featured development environment with HMR',
    recommended: true
  },
  {
    name: 'Stable Development (Port 3001)',
    port: 3001,
    command: 'npm run dev:stable',
    description: 'Conservative config to prevent restart loops',
    recommended: false
  },
  {
    name: 'Alternative Port (Port 3002)',
    port: 3002,
    command: 'npm run dev:port',
    description: 'Alternative stable configuration',
    recommended: false
  },
  {
    name: 'Safe Mode (Port 3003)',
    port: 3003,
    command: 'npm run dev:safe',
    description: 'Maximum stability for troubleshooting',
    recommended: false
  }
];

function checkPortInUse(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();

    server.listen(port, () => {
      server.once('close', () => {
        resolve(false); // Port is available
      });
      server.close();
    });

    server.on('error', () => {
      resolve(true); // Port is in use
    });
  });
}

async function displayPortStatus() {
  console.log('\n🔍 Checking port availability...\n');

  for (const option of developmentOptions) {
    const inUse = await checkPortInUse(option.port);
    const status = inUse ? '🔴 IN USE' : '🟢 AVAILABLE';
    const recommendation = option.recommended ? ' ⭐ RECOMMENDED' : '';

    console.log(`Port ${option.port}: ${status}${recommendation}`);
  }
  console.log('');
}

function displayMenu() {
  console.log('🚀 Broker Analysis Development Server\n');
  console.log('Select a development environment:\n');

  developmentOptions.forEach((option, index) => {
    const recommendation = option.recommended ? ' ⭐' : '   ';
    console.log(`${recommendation} ${index + 1}. ${option.name}`);
    console.log(`       ${option.description}`);
    console.log('');
  });

  console.log('   0. Exit\n');
}

function getUserChoice() {
  return new Promise((resolve) => {
    rl.question('Enter your choice (1-4, or 0 to exit): ', (answer) => {
      const choice = parseInt(answer.trim());

      if (choice === 0) {
        console.log('👋 Goodbye!');
        rl.close();
        process.exit(0);
      }

      if (choice >= 1 && choice <= developmentOptions.length) {
        resolve(choice - 1);
      } else {
        console.log('❌ Invalid choice. Please select 1-4 or 0 to exit.\n');
        return getUserChoice();
      }
    });
  });
}

async function startDevelopment(optionIndex) {
  const option = developmentOptions[optionIndex];

  // Check if port is in use
  const portInUse = await checkPortInUse(option.port);

  if (portInUse) {
    console.log(`\n⚠️  Port ${option.port} is already in use!`);
    console.log('Please choose a different port or stop the process using this port.\n');
    return false;
  }

  console.log(`\n🎯 Starting ${option.name}...\n`);
  console.log(`📡 Frontend will be available at: http://localhost:${option.port}`);
  console.log(`🔧 API Proxy will be available at: http://localhost:3001`);
  console.log(`🏥 Health check: http://localhost:3001/health`);
  console.log('\n📝 Command being executed:', option.command);
  console.log('\n⏹️  Press Ctrl+C to stop the server\n');
  console.log('─'.repeat(50));

  // Close readline interface before starting the dev server
  rl.close();

  // Start the development server
  const [cmd, ...args] = option.command.split(' ');
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error(`❌ Failed to start development server: ${error.message}`);
    process.exit(1);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping development server...');
    child.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    process.exit(0);
  });
}

async function main() {
  try {
    await displayPortStatus();
    displayMenu();

    // If there's a command line argument, use it
    const portArg = process.argv.find(arg => arg.startsWith('--port='));
    if (portArg) {
      const requestedPort = parseInt(portArg.split('=')[1]);
      const optionIndex = developmentOptions.findIndex(opt => opt.port === requestedPort);

      if (optionIndex !== -1) {
        await startDevelopment(optionIndex);
        return;
      } else {
        console.log(`❌ No configuration found for port ${requestedPort}\n`);
        console.log('Available ports:', developmentOptions.map(opt => opt.port).join(', '));
        process.exit(1);
      }
    }

    const choice = await getUserChoice();
    await startDevelopment(choice);

  } catch (error) {
    console.error('❌ An error occurred:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Handle help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📖 Development Port Selector

Usage:
  node scripts/dev-port-selector.js           # Interactive mode
  node scripts/dev-port-selector.js --help   # Show this help
  node scripts/dev-port-selector.js --port=3000  # Start specific port

Available ports:
  3000 - Standard Development (recommended)
  3001 - Stable Development
  3002 - Alternative Port
  3003 - Safe Mode

Examples:
  node scripts/dev-port-selector.js          # Interactive selection
  node scripts/dev-port-selector.js --port=3000  # Start on port 3000
  npm run dev:selector                       # Interactive selection
`);
  process.exit(0);
}

// Run the main function
main();