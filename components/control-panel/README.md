# Control Panel Component

This folder contains the modular control panel component for the "duh" application.

## Files

### `control-panel.html`
Contains the HTML structure for the control panel including:
- Header with title
- Click count display
- Reset counter button
- Close app button

### `control-panel.css`
Contains all the styling for the control panel:
- Panel positioning and animations
- Header styling with gradient background
- Button styling consistent with the main app design
- Responsive layout for control items

### `control-panel.js`
Contains the ControlPanel class with the following functionality:
- Dynamic loading of HTML content
- Toggle show/hide with smooth animations
- Event handling for all control panel interactions
- Click count display updates
- Click-outside-to-close functionality

## Usage

The control panel is automatically initialized when the DOM is ready. It can be controlled through:

```javascript
// Initialize (done automatically)
const controlPanel = new ControlPanel();

// Toggle visibility
controlPanel.toggle();

// Hide panel
controlPanel.hide();

// Update click count display
controlPanel.updateClickCountDisplay();
```

## Integration

The control panel is integrated into the main application through:
1. CSS link in `index.html`
2. JavaScript include in `index.html`
3. Initialization in `script.js`

## Triggers

- **Shift + Click** on the main "duh" button toggles the control panel
- **Click outside** the panel closes it
- **Reset Counter** button resets the click count to 0
- **Close App** button closes the entire application 