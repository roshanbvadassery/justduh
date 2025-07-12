let clickCount = 0;

document.getElementById('duh-button').addEventListener('click', async () => {
    try {
        clickCount = await window.electron.ipcRenderer.invoke('duh-clicked');
        console.log(`Frontend: Button clicked ${clickCount} times`);
    } catch (error) {
        console.error('Error clicking duh button:', error);
    }
}); 