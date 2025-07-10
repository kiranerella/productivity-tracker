import * as vscode from 'vscode';

export class TrackerPanel {
  public static currentPanel: TrackerPanel | undefined;

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._update();
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.ViewColumn.Beside;

    if (TrackerPanel.currentPanel) {
      TrackerPanel.currentPanel._panel.reveal(column);
    } else {
      const panel = vscode.window.createWebviewPanel(
        'trackerPanel',
        'Productivity Tracker',
        column,
        { enableScripts: true }
      );

      TrackerPanel.currentPanel = new TrackerPanel(panel, extensionUri);
    }
  }

  private _update() {
    this._panel.webview.html = this._getHtmlForWebview();
  }

  private _getHtmlForWebview() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Productivity Tracker</title>
        <style>
          body { font-family: sans-serif; padding: 10px; }
          .status { color: green; }
        </style>
      </head>
      <body>
        <h2>🚀 Productivity Tracker</h2>
        <p class="status">Tracker running...</p>
        <p>Next commit: <b>~30min</b></p>
        <p>Last commit: <i>none yet</i></p>
        <button onclick="alert('TODO: Start/Stop tracker')">Start/Stop</button>
      </body>
      </html>`;
  }
}
