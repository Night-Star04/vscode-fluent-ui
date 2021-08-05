const path = require('path');
const fs = require('fs');
const vscode = require('vscode');

// const diff = require('semver/functions/diff');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  this.extensionName = 'LeandroRodrigues.fluent-ui-vscode';

  const config = vscode.workspace.getConfiguration('fluent');

  // let disableEffects = config && config.disableEffects ? !!config.disableEffects : false;

  const themeMode = vscode.window.activeColorTheme;

  let disposable = vscode.commands.registerCommand('fluent.enableEffects', function () {
    const isWin = /^win/.test(process.platform);
    const appDir = path.dirname(require.main.filename);
    const base = appDir + (isWin ? '\\vs\\code' : '/vs/code');

    const htmlFile =
      base +
      (isWin
        ? '\\electron-browser\\workbench\\workbench.html'
        : '/electron-browser/workbench/workbench.html');

    const templateFile =
      base +
      (isWin
        ? '\\electron-browser\\workbench\\fluent.js'
        : '/electron-browser/workbench/fluent.js');

    try {
      // generate production theme JS

      let mode = 'light';
      switch (themeMode.kind) {
        case 2:
          mode = 'dark';
          break;
        case 3:
          mode = 'HighContrast';
          break;
        case 1:
        default:
          break;
      }

      let chromeStyles = fs.readFileSync(__dirname + '/css/editor_chrome.css', 'utf-8');

      if (themeMode.kind === 2) {
        chromeStyles = fs.readFileSync(__dirname + '/css/editor_chrome_dark.css', 'utf-8');
      }

      const jsTemplate = fs.readFileSync(__dirname + '/js/theme_template.js', 'utf-8');

      const themeWithChrome = jsTemplate.replace(/\[CHROME_STYLES\]/g, chromeStyles);

      fs.writeFileSync(templateFile, themeWithChrome, 'utf-8');

      // modify workbench html
      const html = fs.readFileSync(htmlFile, 'utf-8');

      // check if the tag is already there
      const isEnabled = html.includes('fluent.js');

      if (!isEnabled) {
        let output = html.replace(
          /^.*(<!-- Fluent UI --><script src="fluent.js"><\/script><!-- Fluent UI -->).*\n?/gm,
          '',
        );
        // add script tag
        output = html.replace(
          /\<\/html\>/g,
          `	<!-- Fluent UI --><script src="fluent.js"></script><!-- Fluent UI -->\n`,
        );
        output += '</html>';

        fs.writeFileSync(htmlFile, output, 'utf-8');

        vscode.window
          .showInformationMessage(
            "Fluent UI is enabled. VS code must reload for this change to take effect. Code may display a warning that it is corrupted, this is normal. You can dismiss this message by choosing 'Don't show this again' on the notification.",
            { title: 'Restart editor to complete' },
          )
          .then(function (msg) {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
          });
      } else {
        vscode.window
          .showInformationMessage('Fluent UI is already enabled. Reload to refresh JS settings.', {
            title: 'Restart editor to refresh settings',
          })
          .then(function (msg) {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
          });
      }
    } catch (e) {
      if (/ENOENT|EACCES|EPERM/.test(e.code)) {
        vscode.window.showInformationMessage(
          'You must run VS code with admin priviliges in order to enable Fluent UI.',
        );
        return;
      } else {
        vscode.window.showErrorMessage('Something went wrong when starting Fluent UI');
        return;
      }
    }
  });

  let disable = vscode.commands.registerCommand('fluent.disableEffects', uninstall);

  let startup = vscode.commands.registerCommand('fluent.startup', function () {
    console.log('VSCode start up event complete.');
  });

  context.subscriptions.push(startup);
  context.subscriptions.push(disposable);
  context.subscriptions.push(disable);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
  // ...
}

function uninstall() {
  var isWin = /^win/.test(process.platform);
  var appDir = path.dirname(require.main.filename);
  var base = appDir + (isWin ? '\\vs\\code' : '/vs/code');
  var htmlFile =
    base +
    (isWin
      ? '\\electron-browser\\workbench\\workbench.html'
      : '/electron-browser/workbench/workbench.html');

  // modify workbench html
  const html = fs.readFileSync(htmlFile, 'utf-8');

  // check if the tag is already there
  const isEnabled = html.includes('fluent.js');

  if (isEnabled) {
    // delete synthwave script tag if there
    let output = html.replace(
      /^.*(<!-- Fluent UI --><script src="fluent.js"><\/script><!-- Fluent UI -->).*\n?/gm,
      '',
    );
    fs.writeFileSync(htmlFile, output, 'utf-8');

    vscode.window
      .showInformationMessage(
        'Fluent UI is disabled. VS code must reload for this change to take effect',
        { title: 'Restart editor to complete' },
      )
      .then(function (msg) {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      });
  } else {
    vscode.window.showInformationMessage("Fluent UI isn't running.");
  }
}

module.exports = {
  activate,
  deactivate,
};
