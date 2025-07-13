import * as vscode from 'vscode';
import * as path from 'path';

export class DashboardPanel {
  public static render(extensionUri: vscode.Uri) {
    // fallback joinPath for older VSCode
    const webDir = vscode.Uri.joinPath
      ? vscode.Uri.joinPath(extensionUri, 'web')
      : vscode.Uri.file(path.join(extensionUri.fsPath, 'web'));

    const panel = vscode.window.createWebviewPanel(
      'productivityDashboard',
      'Productivity Dashboard',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [webDir]
      }
    );

    panel.webview.html = DashboardPanel.getWebviewContent();
  }

  private static getWebviewContent(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Productivity Dashboard</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h1 { color: #007acc; }
        </style>
      </head>
      <body>
        <h1>Productivity Dashboard</h1>
        <p>This is your stunning live dashboard!</p>
      </body>
      </html>
    `;
  }
}
