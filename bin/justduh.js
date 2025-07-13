#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Get the path to the main.js file
const mainPath = path.join(__dirname, '..', 'main.js');

// Try to use npx to run electron
const child = spawn('npx', ['electron', mainPath], {
    stdio: 'inherit',
    cwd: path.dirname(mainPath)
});

child.on('close', (code) => {
    process.exit(code);
});

child.on('error', (err) => {
    console.error('Failed to start justduh:', err);
    console.error('Make sure you have electron installed or try: npm install -g electron');
    process.exit(1);
}); 