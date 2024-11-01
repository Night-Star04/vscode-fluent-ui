<p align="center">
  <img width="128" align="center" src="/images/icon.png">
</p>
<h1 align="center">
    VS Code Fluent UI
</h1>
<p align="center">
  A Fluent UI theme for Visual Studio Code
</p>
<p align="center">
    <img alt="VS Code" src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/Night-Star04/vscode-fluent-ui">
</p>

Inspired by and based on the awesome concept designs by
[u/zeealeidahmad](https://www.reddit.com/r/Windows11/comments/orbgzl/visual_studio_vs_code_and_github_desktop_with/).

Using CSS3 I tried as much as possible to replicate his designs. Some transparency effects are not
possible at the momend due to the current Electron version that VSCode is using.

## ⚠️Disclaimer⚠️

This is a workbench theme. That means that VS Code's UI is being heavily modified for aestethic
purposes only. There's no intention to enhance or compete with the original look. Is merely an
alternative. Also, please bear in mind that this theme is considered an experiment, and therefore
beta software, since there's no official support for this type of modification, **so used it at your
own risk**.

## Features

-   Fluent UI theme for VS Code
-   Support light/dark theme
-   Customizable accent, dark and light background colors
-   Customizable wallpaper background
-   Support Compact mode

## Install

1. Run VSCode as admin.
    - This is important, the extension won't work otherwise
2. Download the latest version of the installation file from
   [Github](https://github.com/Night-Star04/vscode-fluent-ui/releases)
    - Optiona: Go to settings and adjust the colors (this can be done at any time)
3. Install the extension via the `Install from VSIX` option in the extensions view
    - You can also install it via the command line with `code --install-extension <path-to-vsix>`
4. Run `> Fluent UI: Enable` and reload when prompted

> VSCode will display a notification saying that the installtion is corrupt. That's normal, VSCode
> sees the installation as corrupt because the HTML (workbench.html) file is now changed.
>
> Just click the lil' cog on the message and select `Don't show again` and you should be good to go.

## Uninstall

1. Run VSCode as admin.
    1. This is important, you'll end up with a messed up `workbench.html` file if you run the
       `Disable` command as regular user.
2. Run `> Fluent: Disable` and reload when prompted
3. Uninstall the extension like your normally would

If you ran the command as regular user, here's how you can fix your installation:

1. On Windows, go to
   `C:\Users\{username}\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-sandbox\workbench`.
2. Open the file `workbench.html` as admin
3. Remove everything between the comments `<!-- FUI-CSS-START -->` and `<!-- FUI-CSS-END -->`.

    1. Your `workbench.html` file should look like this after removing the patched code:

    ```html
    <!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <meta
                http-equiv="Content-Security-Policy"
                content="default-src 'none'; img-src 'self' https: data: blob: vscode-remote-resource:; media-src 'self'; frame-src 'self' vscode-webview:; object-src 'self'; script-src 'self' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; connect-src 'self' https: ws:; font-src 'self' https: vscode-remote-resource:;"
            />
            <meta
                http-equiv="Content-Security-Policy"
                content="require-trusted-types-for 'script'; trusted-types amdLoader cellRendererEditorText defaultWorkerFactory diffEditorWidget stickyScrollViewLayer editorGhostText domLineBreaksComputer editorViewLayer diffReview dompurify notebookRenderer safeInnerHtml standaloneColorizer tokenizeToString;"
            />
        </head>

        <body aria-label=""></body>

        <!-- Startup (do not modify order of script tags!) -->
        <script src="workbench.js"></script>
    </html>
    ```

    If that doesn't work, reinstalling VSCode will fix it.

4. Save and reload VSCode

## Settings

See [STEEING](/STEEING.md) for the settings.

## App background

The background feature is intended to mimic, to an extent, the Mica material used by Windows 11
native applications.

## Note

When you install the extension, it will sample the current desktop wallpaper you have set, generate
a blurred version of it and set VSCode window to use that as background. In some cases thay may
cause low contrast or make stuff hard to read, depending on what you have for a wallpaper, so keep
that in mind when running the default installation.

You can disale this feature by unchecking the `Enable background image` in the settings page.

## Screenshots

See [SCREENSHOTS](/SCREENSHOTS.md) for the screenshots.

## Known issues

-   I'm unable to override the terminal, minimap and in some cases, the scrollbar background. So
    depending on the syntax theme you choose, the background colors will be off for those elements.
    You can set the colors for these panels (and others) manually via settings, like so:

```json
"workbench.colorCustomizations": {
  "terminal.background": "#ffffff",
  "minimap.background": "#ffffff"
}
```

## Recommended appearance

### Product icon themes

-   [Fluent Icons](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.fluent-icons)
    (the one you see in the screenshots)
-   [Carbon](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon)

### Standard font

The workbench is set to use Segoe UI Variable (the new standard font for Windows 11). I
highlyrecommend downloading and installing it. If you don't, the theme will fallback to the default
font.

-   [Segoe UI variable](https://docs.microsoft.com/en-us/windows/apps/design/downloads/#fonts)

## Special Thanks

### Main contributors

[TheOld](https://github.com/TheOld) for the
[VSCode-FluentUI](https://github.com/TheOld/vscode-fluent-ui) theme.

### Contributors

[Benno Vasconcellos](https://github.com/MrTadeu), [Night Star](https://github.com/Night-Star04)
