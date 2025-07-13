# just duh.

*The deceptively simple floating button that could change everything.*

[![npm version](https://badge.fury.io/js/justduh.svg)](https://badge.fury.io/js/justduh)
[![npm downloads](https://img.shields.io/npm/dm/justduh.svg)](https://www.npmjs.com/package/justduh)

## Quick Start

Get **just duh** up and running in seconds:

```bash
# Install globally
npm install -g justduh

# Run it
justduh
```

Or try it instantly without installing:

```bash
# Run with npx (no installation needed)
npx justduh
```

## What is this?

**just duh** is a minimalist floating desktop button that sits quietly on your screen, always accessible, always ready. On the surface, it's just a button that says "duh." But beneath that simplicity lies the potential for something much more powerful.

> *"The best interfaces are invisible until you need them."*

## Current Features

### 🎯 The Button
- **Always on top**: Stays visible across all applications and workspaces
- **Draggable**: Position it anywhere on your screen
- **Persistent**: Remembers its position and stays there
- **Cross-platform**: Works on macOS, Windows, and Linux

### 🔒 Hidden Powers
The button has secret functionality that only reveals itself when you know how to unlock it:

- **Single click**: Increments an internal counter (tracking your "duh" moments)
- **Shift + click**: Opens a hidden control panel with stats and controls
- **ESC + click**: Closes the application entirely

### 🎛️ Control Panel
Access the hidden control panel with `Shift + click` to reveal:
- Click counter display
- Reset counter functionality
- Application controls
- *More features coming soon...*

## Installation & Usage

### 🚀 Option 1: Global Installation (Recommended)

```bash
# Install globally
npm install -g justduh

# Run from anywhere
justduh
# or
duh
```

### ⚡ Option 2: Run Without Installing

```bash
# Run instantly with npx
npx justduh
```

### 🛠️ Option 3: Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/justduh.git
cd justduh

# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run build
```

## How to Use

1. **Launch the app**: The button appears on your desktop
2. **Position it**: Drag it to your preferred location
3. **Start clicking**: Each click tracks your "duh" moments
4. **Discover secrets**: Try different key combinations
5. **Access controls**: Shift + click for the control panel

## The Vision

**just duh** is designed to be the ultimate productivity companion that grows with you. Today it's a simple button, but tomorrow it could be:

### 🚀 Automation Hub
- **Quick Actions**: Double-click to trigger your most-used automation
- **Script Launcher**: Right-click menu with custom scripts and shortcuts
- **System Monitor**: Visual indicators for CPU, memory, network status
- **Notification Center**: Aggregate notifications from all your apps

### 🧠 AI Assistant
- **Voice Commands**: "Hey duh, open my morning routine"
- **Smart Suggestions**: Learn your patterns and suggest actions
- **Context Awareness**: Know what you're working on and offer relevant tools
- **Natural Language**: "duh, remind me to call mom in 2 hours"

### 🔗 Integration Platform
- **App Connections**: Connect to Slack, Discord, email, calendar, todo apps
- **Webhook Support**: Trigger external services with a simple click
- **Plugin System**: Community-driven extensions and integrations
- **API Access**: Let other apps interact with your duh button

### 🎨 Customization Engine
- **Themes**: Change appearance based on mood, time of day, or system theme
- **Layouts**: Multiple button arrangements for different workflows
- **Gestures**: Swipe, hold, multi-touch interactions
- **Adaptive UI**: Interface that changes based on context and usage

### 🔐 Privacy-First
- **Local Processing**: All data stays on your device
- **Encrypted Settings**: Your configurations are secure
- **No Tracking**: We don't know what you're clicking
- **Open Source**: Full transparency in how it works

## Technical Details

- **Built with**: Electron for cross-platform compatibility
- **Package size**: Lightweight and fast to install
- **Window size**: Minimal ~220x200px window
- **Performance**: Minimal resource usage
- **Persistence**: Remembers position and settings
- **Available on**: [npm](https://www.npmjs.com/package/justduh)

## Roadmap

- **Phase 1**: ✅ Basic floating button with hidden features
- **Phase 1.5**: ✅ Published on npm for easy installation
- **Phase 2**: 🔄 Plugin system and customization options
- **Phase 3**: 🔮 AI integration and smart features
- **Phase 4**: 🌟 Community marketplace and sharing

## Troubleshooting

### Permission Issues on macOS/Linux
If you get permission errors during installation:

```bash
# Set up npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Now install
npm install -g justduh
```

### Electron Not Found
If you get "electron not found" errors:

```bash
# Try using npx instead
npx justduh
```

## Philosophy

In a world of increasingly complex interfaces, sometimes the most powerful solution is the simplest one. **just duh** embraces the philosophy that the best tools are:

- **Invisible** when you don't need them
- **Instant** when you do need them
- **Intuitive** without requiring explanation
- **Powerful** without being overwhelming

## Contributing

We believe the best ideas come from the community. Whether you want to:
- Report a bug
- Suggest a feature
- Contribute code
- Share your workflow

Visit us at [justduh.com](https://justduh.com) or open an issue here.

## License

MIT License - Because good ideas should be free to grow.

---

*"It's not just a button. It's a philosophy."*

**just duh** - Making the complex simple, one click at a time.

*Now available on npm: `npm install -g justduh`* 