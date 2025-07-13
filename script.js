let clickCount = 0;
let isEscapePressed = false;
let isShiftPressed = false;
let controlPanel = null;

// Create audio object for the duh press sound
const duhPressAudio = new Audio('assets/duh-press.mp3');

// Initialize control panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    controlPanel = new window.ControlPanel();
});

// Track ESC and Shift key states
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        isEscapePressed = true;
    }
    if (event.key === 'Shift') {
        isShiftPressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        isEscapePressed = false;
    }
    if (event.key === 'Shift') {
        isShiftPressed = false;
    }
});

document.getElementById('duh-button').addEventListener('click', async () => {
    try {
        // Play the duh press sound every time the button is clicked
        duhPressAudio.currentTime = 0; // Reset to start in case it's already playing
        duhPressAudio.play().catch(error => {
            console.error('Error playing duh press sound:', error);
        });

        if (isEscapePressed) {
            // ESC is being held down - close the app
            console.log('ESC + duh clicked - closing app');
            await window.electron.ipcRenderer.invoke('close-app');
        } else if (isShiftPressed) {
            // Shift is being held down - toggle control panel
            console.log('Shift + duh clicked - toggling control panel');
            if (controlPanel) {
                controlPanel.toggle();
            }
        } else {
            // Normal click - increment counter
            clickCount = await window.electron.ipcRenderer.invoke('duh-clicked');
            window.clickCount = clickCount; // Make it available globally for the control panel
            console.log(`Frontend: Button clicked ${clickCount} times`);
            if (controlPanel) {
                controlPanel.updateClickCountDisplay();
            }
        }
    } catch (error) {
        console.error('Error clicking duh button:', error);
    }
}); 