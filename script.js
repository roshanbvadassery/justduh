let clickCount = 0;
let isEscapePressed = false;

// Track ESC key state
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        isEscapePressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        isEscapePressed = false;
    }
});

document.getElementById('duh-button').addEventListener('click', async () => {
    try {
        if (isEscapePressed) {
            // ESC is being held down - close the app
            console.log('ESC + duh clicked - closing app');
            await window.electron.ipcRenderer.invoke('close-app');
        } else {
            // Normal click - increment counter
            clickCount = await window.electron.ipcRenderer.invoke('duh-clicked');
            console.log(`Frontend: Button clicked ${clickCount} times`);
        }
    } catch (error) {
        console.error('Error clicking duh button:', error);
    }
}); 