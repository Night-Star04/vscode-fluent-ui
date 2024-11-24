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
