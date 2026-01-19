# Fluent UI Theme Settings

[back to main README](/README.md)

After making any changes to the settings, it is essential to perform the following action to ensure
that the new configurations take effect.

> 1.  Press `Ctrl + Shift + P` to open the command palette.
> 2.  Type `> Fluent UI: Reload` and press `Enter`.
> 3.  The changes will take effect after the window reloads.

If `> Fluent UI: Reload` does not work, be use the alternative method:

> 1.  Press `Ctrl + Shift + P` to open the command palette.
> 2.  Type `> Fluent UI: Disable` and press `Enter`.
> 3.  Close and reopen VSCode.
> 4.  Press `Ctrl + Shift + P` to open the command palette.
> 5.  Type `> Fluent UI: Enable` and press `Enter`.
> 6.  Close and reopen VSCode.
> 7.  The changes will take effect after the window reloads.

## Overview

| Setting                                         | Description                                      | Type    | Default Value                               |
| ----------------------------------------------- | ------------------------------------------------ | ------- | ------------------------------------------- |
| [Accent Color](#accent-color)                   | Primary color used for the theme                 | String  | `#005FB8`                                   |
| [Dark Background](#dark-background)             | Background color for dark mode                   | String  | `#202020`                                   |
| [Light Background](#light-background)           | Background color for light mode                  | String  | `#FFFFFF`                                   |
| [Enable Wallpaper](#enable-wallpaper)           | Enable custom wallpaper                          | Boolean | `false`                                     |
| [Wallpaper Path](#wallpaper-path)               | Path to the wallpaper image                      | String  | `C:\Windows\Web\Wallpaper\Windows\img0.jpg` |
| [Wallpaper Blur Amount](#wallpaper-blur-amount) | Blur amount for the background wallpaper (0-100) | Number  | `50`                                        |
| [Wallpaper Quality](#wallpaper-quality)         | Quality of the background wallpaper (1-100)      | Number  | `80`                                        |
| [Wallpaper Resolution](#wallpaper-resolution)   | Resolution of the background wallpaper           | Enum    | `original`                                  |
| [Wallpaper Format](#wallpaper-format)           | Output format of the background wallpaper        | Enum    | `jpeg`                                      |
| [Compact Mode](#compact-mode)                   | Reduce size of sidebar and activity bar          | Boolean | `false`                                     |


## Color settings

The UI is dynamic and will apply the light and dark themes based on the current syntax theme type.

For example, if you're using
[One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme),
when you run the `> Fluent UI: Reload` command, the UI will switch to the dark theme.

If you're using the default VSCode light theme, the UI will switch to the light theme.

### Accent color

The accent color is the primary color used for the theme.

> **Note**: Valid values are hexadecimal color codes.

**Default value**: `#005FB8`

### Dark Background

This color is used for the background when dark mode is enabled.

> **Note**: Valid values are hexadecimal color codes.

**Default value**: `#202020`

### Light Background

This color is used for the background when light mode is enabled.

> **Note**: Valid values are hexadecimal color codes.

**Default value**: `#FFFFFF`

## Wallpaper settings

### Enable Wallpaper

This setting allows the use of a custom wallpaper.

**Default value**: `false`

For instance, my current wallpaper looks like this:

![Wallpaper](images/wallpaper.png 'Wallpaper')

Enabling the wallpaper setting will make VSCode look like this:

![VSCode with Wallpaper](images/vscode-sample-wp.png 'Wallpaper')

![VSCode with Wallpaper Content](images/vscode-sample-wp-content.png 'Wallpaper')

Disabling the wallpaper setting will make VSCode look like this:

![VSCode without Wallpaper](images/vscode-sample-no-wp.png 'Wallpaper')

![VSCode without Wallpaper Content](images/vscode-sample-no-wp-content.png 'Wallpaper')

### Wallpaper Path

This setting specifies the path to the wallpaper image.

> **Note**: This setting is only applicable if the `Enable Wallpaper` setting is turned on.

**Default value**: `C:\Windows\Web\Wallpaper\Windows\img0.jpg`

### Wallpaper Blur Amount

This setting controls the blur amount for the background wallpaper.

Valid values range from 0 to 100, where:
- Lower values result in sharper images
- Higher values result in more blurred images

> **Note**: This setting is only applicable if the `Enable Wallpaper` setting is turned on.

**Default value**: `50`

#### Preview

Here are some examples of different blur amounts:

| Blur Amount  | Preview Image                                     |
| ------------ | ------------------------------------------------- |
| 0            | ![Blur 0](images/blur-0.png 'Blur 0')             |
| 5            | ![Blur 5](images/blur-5.png 'Blur 5')             |
| 25           | ![Blur 25](images/blur-25.png 'Blur 25')          |
| 50 (default) | ![Blur 50](images/vscode-sample-wp.png 'Blur 50') |
| 75           | ![Blur 75](images/blur-75.png 'Blur 75')          |
| 100          | ![Blur 100](images/blur-100.png 'Blur 100')       |

The above images are based on this original wallpaper:

![Original](images/wallpaper.png 'Original')

### Wallpaper Quality

This setting controls the quality of the background wallpaper image.

Valid values range from 1 to 100, where:
- Lower values result in smaller file sizes but reduced quality
- Higher values result in better quality but larger file sizes

> **Note**: This setting is only applicable if the `Enable Wallpaper` setting is turned on.
>
> **Important**: High quality images may increase VS Code startup time.

**Default value**: `80`

### Wallpaper Resolution

This setting controls the resolution for the background wallpaper.

Available options:
- `original` - Use the original resolution of the source image
- `1920x1080` - Full HD (16:9) - lower memory usage, recommended for most displays
- `2560x1440` - QHD (16:9) - balanced quality and performance
- `3840x2160` - 4K UHD (16:9) - highest quality, higher memory usage
- `1920x1200` - WUXGA (16:10) - optimized for productivity displays
- `2560x1600` - WQXGA (16:10) - high quality for large 16:10 screens
- `3840x2400` - 4K+ (16:10) - ultra-high resolution for premium displays

Lower resolutions reduce memory usage and improve performance.

> **Note**: This setting is only applicable if the `Enable Wallpaper` setting is turned on.

**Default value**: `original`

### Wallpaper Format

This setting controls the output format for the background wallpaper.

Available formats:
- `jpeg` - Best compression, smaller file sizes
- `png` - Lossless quality, larger file sizes
- `webp` - Balanced compression with good quality

> **Note**: This setting is only applicable if the `Enable Wallpaper` setting is turned on.

**Default value**: `jpeg`

## Compact mode

Compact mode reduces the size of the sidebar and the activity bar, which can be useful for
maximizing the space available for the editor.

**Default value**: `false`

Enabling compact mode will make VSCode appear like this:

![Compact mode on](/images/compact-mode.png)

Disabling compact mode will make VSCode appear like this:

![Compact mode off](/images/normal-mode.png)

---

_Give your Visual Studio Code a modern, Fluent UI-inspired makeover today!_

_If you like this fluently themed extension, please consider giving it a ⭐!_

[Back to top](#fluent-ui-theme-settings)
