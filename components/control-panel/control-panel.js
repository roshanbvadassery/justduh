// Control Panel Module
class ControlPanel {
    constructor() {
        this.isVisible = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadControlPanelHTML();
    }

    async loadControlPanelHTML() {
        try {
            const response = await fetch('components/control-panel/control-panel.html');
            const html = await response.text();
            document.body.insertAdjacentHTML('beforeend', html);
        } catch (error) {
            console.error('Error loading control panel HTML:', error);
        }
    }

    toggle() {
        const controlPanel = document.getElementById('control-panel');
        if (!controlPanel) return;

        if (controlPanel.style.display === 'none' || controlPanel.style.display === '') {
            controlPanel.style.display = 'block';
            controlPanel.classList.add('show');
            this.isVisible = true;
            this.updateClickCountDisplay();
        } else {
            controlPanel.classList.remove('show');
            this.isVisible = false;
            setTimeout(() => {
                controlPanel.style.display = 'none';
            }, 300);
        }
    }

    hide() {
        const controlPanel = document.getElementById('control-panel');
        if (!controlPanel || !this.isVisible) return;

        controlPanel.classList.remove('show');
        this.isVisible = false;
        setTimeout(() => {
            controlPanel.style.display = 'none';
        }, 300);
    }

    updateClickCountDisplay() {
        const clickCountDisplay = document.getElementById('click-count-display');
        if (clickCountDisplay && window.clickCount !== undefined) {
            clickCountDisplay.textContent = window.clickCount;
        }
    }

    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait a bit for the HTML to be loaded
            setTimeout(() => {
                this.bindControlPanelEvents();
            }, 100);
        });

        // If DOM is already loaded
        if (document.readyState === 'loading') {
            // DOM is still loading
        } else {
            // DOM is already loaded, bind events after a short delay
            setTimeout(() => {
                this.bindControlPanelEvents();
            }, 100);
        }
    }

    bindControlPanelEvents() {
        // Close control panel when clicking outside
        document.addEventListener('click', (event) => {
            const controlPanel = document.getElementById('control-panel');
            const duhButton = document.getElementById('duh-button');
            
            if (controlPanel && duhButton && 
                !controlPanel.contains(event.target) && 
                !duhButton.contains(event.target)) {
                this.hide();
            }
        });

        // Reset counter button
        const resetButton = document.getElementById('reset-counter');
        if (resetButton) {
            resetButton.addEventListener('click', async () => {
                try {
                    window.clickCount = await window.electron.ipcRenderer.invoke('reset-counter');
                    console.log('Counter reset');
                    this.updateClickCountDisplay();
                } catch (error) {
                    console.error('Error resetting counter:', error);
                }
            });
        }

        // Close app button
        const closeAppButton = document.getElementById('close-app');
        if (closeAppButton) {
            closeAppButton.addEventListener('click', async () => {
                try {
                    console.log('Closing app from control panel');
                    await window.electron.ipcRenderer.invoke('close-app');
                } catch (error) {
                    console.error('Error closing app:', error);
                }
            });
        }
    }
}

// Export for use in main script
window.ControlPanel = ControlPanel; 