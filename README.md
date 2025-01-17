<div align="center">
  <img
    src="https://raw.githubusercontent.com/Night-Star04/vscode-fluent-ui/refs/heads/main/images/icon.png"
    width="128"
  />
  <h1>Visual Studio Code Fluent UI</h1>
  <p>Gives your Visual Studio Code a modern, Fluent UI-inspired makeover!</p>
  <div align="center">
    <a href="https://github.com/Night-Star04/vscode-fluent-ui/releases/latest">
      <img
        src="https://img.shields.io/github/v/release/Night-Star04/vscode-fluent-ui?style=for-the-badge&logo=github&logoColor=white&label=Latest%20Release"
        alt="Latest Release"
      />
    </a>
    <img
      src="https://img.shields.io/github/downloads/Night-Star04/vscode-fluent-ui/total?style=for-the-badge&logo=github&logoColor=white&label=Downloads"
      alt="GitHub Downloads (all release)"
    />
    <img
      src="https://img.shields.io/github/issues/Night-Star04/vscode-fluent-ui?style=for-the-badge&logo=github&logoColor=white&label=Issues"
      alt="GitHub Issues"
    />
  </div>
</div>

<div align="center">English | <a href="README-zh-TW.md">繁體中文</a></div>

Enhance your Visual Studio Code experience with a modern, Fluent UI-inspired theme.

VS Code Fluent UI is a theme extension that brings the sleek aesthetics of Microsoft's Fluent UI
design to Visual Studio Code. It offers features like blurred backgrounds, compact mode, and
customizable color schemes to provide a refined coding environment.

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
> This is a workbench theme designed to heavily modify VS Code's UI purely for aesthetic purposes.
> It is not intended to enhance or compete with the original design but rather to offer an
> alternative look.
>
> Please note that this theme is experimental and considered beta software. Since there is no
> official support for such modifications, **use it at your own risk**.

## Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Features](#features)
-   [Installation](#installation)
-   [Uninstallation](#uninstallation)
-   [Configuration Options](#configuration-options)
    -   [Default settings](#default-settings)
-   [FAQ](#faq)
-   [Changelog](#changelog)
    -   [Latest version changes](#latest-version-changes)
-   [Preview](#preview)
-   [Recommended matching themes](#recommended-matching-themes)
    -   [Product icon themes](#product-icon-themes)
    -   [Standard font](#standard-font)
-   [Contribution Guidelines](#contribution-guidelines)
-   [Issues and Feature Requests Guidelines](#issues-and-feature-requests-guidelines)
-   [License](#license)
-   [Acknowledgements](#acknowledgements)
    -   [Contributors](#contributors)

## Features

-   Windows 11 Mica Effect
    -   Applies a blurred wallpaper background to emulate Fluent UI's Mica material.
-   Support light/dark theme
    -   Choose between light and dark accent colors to match your system theme.
-   Customizable wallpaper background
    -   Personalize the wallpaper background with your own image.
-   Customizable accent colors
    -   Personalize the theme with your preferred accent colors.
-   Compact Mode
    -   Reduces padding around UI elements to maximize screen space.

## Installation

1. Download the latest version of the installation file from
   [Releases](https://github.com/Night-Star04/vscode-fluent-ui/releases/latest)
2. Run Visual Studio Code as administrator
3. Install the extension

    - Open the extensions view (`Ctrl+Shift+X`)
    - Click on the ellipsis (`...`) and select `Install from VSIX...`
    - Select the downloaded `.vsix` file
    - Click `Install`

    > You can also install it via the command line with `code --install-extension <path-to-vsix>`

4. Configure the extension settings (optional)

    - Open the settings view (`Ctrl+,`)
    - Search for `@ext:NightSky-Studio.vscode-fluent-ui`
    - Adjust the settings to your preference

    > If you don't see the settings, make sure you have the extension enabled

5. Enable the extension

    - Open the command palette (`Ctrl+Shift+P`)
    - Run the command `> Fluent: Enable`
    - Wait for the command to finish
    - Reload the window when prompted

6. Handle "Corrupt installation" warning

    - Click the cog icon on the notification
    - Select `Don't show again`
    - You should be good to go

7. Enjoy the Fluent UI theme!

> [!TIP]
>
> If you encounter any issues, please refer to the [FAQ](#faq) section.
>
> When you install the extension, it will sample the current desktop wallpaper you have set,
> generate a blurred version of it and set VSCode window to use that as background.
>
> In some cases thad may cause low contrast or make stuff hard to read, depending on what you have
> for a wallpaper, so keep that in mind when running the installation.
>
> You can disable this feature by unchecking the `Enable background image` in the settings page.

## Uninstallation

1. Run Visual Studio Code as administrator
2. Disable the extension

    - Open the command palette (`Ctrl+Shift+P`)
    - Run the command `> Fluent: Disable`
    - Wait for the command to finish
    - Reload the window when prompted

3. Uninstall the extension

    - Open the extensions view (`Ctrl+Shift+X`)
    - Search for `@installed Fluent UI`
    - Click the cog `⚙️` icon
    - Click `Uninstall`

    > You can also uninstall it via the command line with
    > `code --uninstall-extension NightSky-Studio.vscode-fluent-ui`

4. Enjoy the default VS Code theme!

> [!TIP]
>
> If you encounter any issues, please refer to the [FAQ](#faq) section.

## Configuration Options

The extension provides several settings to customize the theme to your liking. You can adjust the
theme's appearance, wallpaper background, accent colors, and more.

Details on the available settings can be found in the [Settings](/STEEING.md) page.

### Default settings

```json
{
    // Applies slight less padding around some of the elements.
    // The difference is subtle but can help those with limited space.
    "fluentui.compact": false,
    // Enable background image
    "fluentui.enableWallpaper": false,
    // Path to image. By default, it will use the default Windows 11 wallpaper for the Windows light theme.
    "fluentui.wallpaperPath": "C:\\Windows\\Web\\Wallpaper\\Windows\\img0.jpg",
    // Accent color. Only HEX values are supported.
    "fluentui.accent": "#005fb8",
    // Background color for dark mode. Only HEX values are supported.
    "fluentui.darkBackground": "#202020",
    // Background color for light mode. Only HEX values are supported.
    "fluentui.lightBackground": "#ffffff"
}
```

## FAQ

This section only covers the most common issues. If you encounter any other problems, please check
the [Troubleshooting](/TROUBLESHOOTING.md) page or open an new issue on the github.

1. **Why does the corrupt installation warning appear?**

    This is normal, don't worry. This is expected behavior and is necessary for the extension to
    work.

    When you install the extension, extensions modify the workbench html file to apply the theme.
    Visual Studio Code sees the installation as corrupt because the file has been modified.

2. **Why can’t I use the default theme’s visual studio code normally after uninstalling it?**

    This is possible, but the chances are slim.

    If you encounter this issue, please follow the steps below to fix it. Please refer to the
    [uninstallation](/TROUBLESHOOTING.md#uninstallation) section for further instructions.

3. **Can I use this with other extensions?**

    Yes, you can use this theme with other extensions. However, some extensions may not be
    compatible with this theme.

    If you encounter any issues, please disable the theme and check if the problem persists. If it
    does, the issue is likely caused by the extension. Please open an new issue on the github.

## Changelog

### Latest version changes

```markdown
Version 4.5.0 (2025-01-17)

# Features

-   Use theme colors in single-tab mode title bar. (#21)
-   Add padding and update breadcrumbs background in single-tab mode title bar.

# Fixes

-   Correct padding for file/directory input box in Explorer. (#22)
-   Update dependencies to resolve npm warnings (#26)

# Refactors

-   Reorganize esbuild configuration for better maintainability. (#11)
-   Minify CSS/JS directly during the build process.
-   Add GitHub workflows for CI, release tagging, and extension builds.
```

You can find the full changelog in the [Changelog](/CHANGELOG.md) page.

## Preview

You can see the preview image in the [Preview](/PREVIEW.md) page.

Want to provide your own preview? Feel free to submit a PR!

## Recommended matching themes

### Product icon themes

-   [Fluent Icons](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.fluent-icons)
-   [Carbon](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon)

### Standard font

The workbench is set to use Segoe UI Variable (the new standard font for Windows 11). I highly
recommend downloading and installing it. If you don't, the theme will fallback to the default font.

-   [Segoe UI variable](https://docs.microsoft.com/en-us/windows/apps/design/downloads/#fonts)

## Contribution Guidelines

Please refer to the [CONTRIBUTING](/CONTRIBUTING) page for details on how to contribute to this
project.

## Issues and Feature Requests Guidelines

Please refer to the [ISSUES](/ISSUES) page for details on how to report issues and request features

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.

## Acknowledgements

-   [u/zeealeidahmad](https://www.reddit.com/r/Windows11/comments/orbgzl/visual_studio_vs_code_and_github_desktop_with/)
    for the original concept designs.
-   [TheOld](https://github.com/TheOld) for the
    [VSCode-FluentUI](https://github.com/TheOld/vscode-fluent-ui) theme. This project is based on
    his work.

### Contributors

<a href="https://github.com/Night-Star04/vscode-fluent-ui/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Night-Star04/vscode-fluent-ui" />
</a>

---

_Give your Visual Studio Code a modern, Fluent UI-inspired makeover today!_

_If you like this fluently themed extension, please consider giving it a ⭐!_
