# Agent Dock

> Easy switch between AI agents via a floating button or floating dock in your browser.

A Chrome extension that provides quick access to your favorite AI agents and web apps through a beautiful floating action button (FAB) or vertical dock interface.

## ✨ Features

- **🎯 Quick Access Panel**: Click the floating button to open a grid of your favorite links
- **📍 Floating Dock Mode**: Alternative vertical dock display for always-visible shortcuts
- **🎨 Adaptive Design**: Automatically adapts to light and dark mode based on your system preferences
- **⚡ Fast Navigation**: One-click access to your most-used AI agents (ChatGPT, Claude, Gemini, etc.)
- **🔧 Fully Customizable**: Add, remove, and organize your own links
- **📱 Responsive**: Works seamlessly across different screen sizes
- **♿ Accessible**: Built with ARIA labels and keyboard navigation support

## 🚀 Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/hailerity/agent-dock.git
   cd agent-dock
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the `agent-dock` directory

5. The Agent Dock icon should appear in your extensions bar!

## 📖 Usage

### Adding Links

1. Click the Agent Dock extension icon in your toolbar
2. Enter a title and URL in the input fields
3. Click "Add" to save the link
4. The link will appear in both the popup and the floating panel

### Display Modes

**FAB Mode (Default)**
- A floating action button appears in the bottom-right corner of web pages
- Click it to reveal a quick-access panel with your links

**Dock Mode**
- A vertical dock of icons appears on the right side of web pages
- Always visible for instant access
- Toggle between modes using the "Display" button in the popup

### Side Panel

Click "Open side panel" in the popup or panel header to open a full side panel view with additional options.

### Theme Options

- **Auto**: Follows your system's light/dark mode preference
- **Light**: Always use light theme
- **Dark**: Always use dark theme

## 🎨 Customization

The extension uses CSS variables for easy theming. You can modify `sidebar.css` to customize:

- Colors and gradients
- Button sizes and positioning
- Shadow effects
- Border radius
- Spacing and layout

## 🛠️ Development

### Project Structure

```
agent-dock/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for navigation
├── content.js            # Injected UI components
├── popup.html            # Extension popup interface
├── popup.js              # Popup logic
├── sidepanel.html        # Side panel interface
├── sidepanel.js          # Side panel logic
├── settings.js           # Settings management
├── sidebar.css           # Styles for FAB and panel
└── icons/               # Extension icons
    ├── icon.png
    ├── icon16.png
    ├── icon64.png
    └── icon128.png
```

### Key Files

- **`content.js`**: Creates and manages the FAB button, panel, and dock on web pages
- **`popup.js`**: Handles the extension popup where users manage their links
- **`background.js`**: Service worker that handles navigation between links
- **`sidebar.css`**: All styles for the floating UI components

### Building

No build process required! This is a pure JavaScript extension.

### Testing

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Agent Dock extension
4. Reload any open web pages to see changes

## 🔒 Permissions

The extension requires the following permissions:

- **`storage`**: To save your links and preferences
- **`tabs`**: To open links in the current tab
- **`scripting`**: To inject the FAB/dock UI into web pages
- **`sidePanel`**: To display the side panel interface
- **`<all_urls>`**: To show the FAB/dock on all websites

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

If you encounter any issues or have questions:

1. Check existing [Issues](https://github.com/hailerity/agent-dock/issues)
2. Create a new issue with detailed information
3. Include your Chrome version and steps to reproduce
