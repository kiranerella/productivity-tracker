// console.log('[DASHBOARD] Rendering with summaries:', summaries.length);
import * as vscode from 'vscode';
import * as path from 'path';


export class DashboardPanel {
  public static render(extensionUri: vscode.Uri, summaries: string[]) {
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

    panel.webview.html = DashboardPanel.getWebviewContent(summaries);
  }

  private static getWebviewContent(summaries: string[]): string {
    const renderedSummaries = summaries.map((summary: string, i: number) => `
      <div class="summary-block">
        <h3>Summary ${i + 1}</h3>
        <pre>${summary}</pre>
      </div>
    `).join('\n');
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Productivity Dashboard</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h1 { color: #007acc; }
          .summary-block {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f9f9f9;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <h1>Productivity Dashboard</h1>
        <p style="color: red; font-weight: bold;">LIVE BUILD: ${new Date().toISOString()}</p>
        <p>Updated at: ${new Date().toLocaleString()}</p>
        ${renderedSummaries}
      </body>
      </html>
    `;
  }
}

