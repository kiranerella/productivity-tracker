import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class DashboardPanel {
  public static currentPanel: DashboardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update();
  }

  public static show(extensionUri: vscode.Uri) {
    const column = vscode.ViewColumn.One;

    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel._panel.reveal(column);
    } else {
      const panel = vscode.window.createWebviewPanel(
        'productivityDashboard',
        'Productivity Tracker',
        column,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'web')]
        }
      );

      DashboardPanel.currentPanel = new DashboardPanel(panel, extensionUri);

      panel.onDidDispose(() => {
        DashboardPanel.currentPanel = undefined;
      });
    }
  }

  private _update() {
    const htmlPath = path.join(this._extensionUri.fsPath, 'web', 'dashboard.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    this._panel.webview.html = html;
  }
}
