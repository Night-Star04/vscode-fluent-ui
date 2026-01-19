<div align="center">
  <img
    src="https://raw.githubusercontent.com/Night-Star04/vscode-fluent-ui/refs/heads/main/images/icon.png"
    width="128"
  />
  <h1>Visual Studio Code Fluent UI</h1>
  <p>Gives your Visual Studio Code a modern, Fluent UI-inspired makeover!</p>
  <p>
    Enhance your Visual Studio Code experience with a modern, Fluent UI-inspired theme.
  </p>
</div>

This extension brings Microsoft's Fluent UI design aesthetic to VS Code with blurred backgrounds,
customizable colors, and a refined interface.

Inspired by and based on the awesome concept designs by
[u/zeealeidahmad](https://www.reddit.com/r/Windows11/comments/orbgzl/visual_studio_vs_code_and_github_desktop_with/).

<div align="center">
  <img
    src="https://raw.githubusercontent.com/Night-Star04/vscode-fluent-ui/refs/heads/main/images/vscode-sample-wp-content.png"
    alt="Preview"
  />
</div>

> [!CAUTION]
>
> ## ⚠️DISCLAIMER⚠️
>
> This theme heavily modifies VS Code's UI for aesthetic purposes.
>
> It's experimental and considered beta software - **use at your own risk**.

## Features

- **Windows 11 Mica Effect** - Blurred wallpaper background emulating Fluent UI's Mica material
- **Light/Dark Theme Support** - Choose between light and dark accent colors
- **Customizable Background & Colors** - Personalize with your own wallpaper and accent colors
- **Compact Mode** - Reduce padding around UI elements to maximize workspace

## Quick Start

1. **Install** the extension from
   [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=NightSky-Studio.vscode-fluent-ui-continued)
   or [Open VSX](https://open-vsx.org/extension/NightSky-Studio/vscode-fluent-ui-continued)
2. **Enable** the extension: Open the command palette (`Ctrl+Shift+P`) and run `> Fluent: Enable`
3. **Configure** (optional): Open settings (`Ctrl+,`) and search for
   `@ext:NightSky-Studio.vscode-fluent-ui-continued`

> **Note:** If you see a "Corrupt Installation" warning, this is expected. Click the cog icon and
> select "Don't show again".

## Common Settings

```json
{
    // Applies slight less padding around some of the elements.
    // The difference is subtle but can help those with limited space.
    "fluentui.compact": false,
    // Enable background image
    "fluentui.enableWallpaper": false,
    // Path to image. By default, it will use the default Windows 11 wallpaper for the Windows light theme.
    "fluentui.wallpaperPath": "C:\\Windows\\Web\\Wallpaper\\Windows\\img0.jpg",
    // Blur amount for the background wallpaper (0-100). Lower values result in sharper images.
    "fluentui.wallpaperBlurAmount": 50,
    // Quality of the background wallpaper image (1-100). Higher values result in better quality but larger file size.
    // Note: High quality images may increase VS Code startup time.
    "fluentui.wallpaperQuality": 80,
    // Resolution for the background wallpaper. 'original' preserves the source image resolution.
    // Lower resolutions reduce memory usage and improve performance.
    "fluentui.wallpaperResolution": "original",
    // Output format for the background wallpaper.
    // JPEG offers best compression, PNG offers lossless quality, WebP offers balanced compression.
    "fluentui.wallpaperFormat": "jpeg",
    // Accent color. Only HEX values are supported.
    "fluentui.accent": "#005fb8",
    // Background color for dark mode. Only HEX values are supported.
    "fluentui.darkBackground": "#202020",
    // Background color for light mode. Only HEX values are supported.
    "fluentui.lightBackground": "#ffffff"
}
```

## FAQ

- **Corrupt installation warning?** This is normal and expected. The extension modifies VSCode's
  workbench HTML file.
- **Corrupt setting has changed?** This is normal and expected. The extension modifies the global
  settings to apply Fluent UI styles.
- **Problems after uninstalling?** See our
  [uninstallation troubleshooting guide](https://github.com/Night-Star04/vscode-fluent-ui/blob/main/TROUBLESHOOTING.md#uninstallation).
- **Compatible with other extensions?** Yes, but some extensions may have compatibility issues.

## Recommended Companion Extensions

- [Fluent Icons](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.fluent-icons)
- [Carbon Icons](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon)

For more information, see our
[full documentation](https://github.com/Night-Star04/vscode-fluent-ui).

---

_✨ Give your Visual Studio Code a modern, Fluent UI-inspired makeover today!_

_⭐ If you enjoy this extension, please consider giving it a star on
[GitHub](https://github.com/Night-Star04/vscode-fluent-ui)!_
