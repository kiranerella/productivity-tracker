// console.log('[DASHBOARD] Rendering with summaries:', summaries.length);
import * as vscode from 'vscode';
import * as path from 'path';


export class DashboardPanel {
  public static render(extensionUri: vscode.Uri, summaries: string[]) {
    const webDir = vscode.Uri.joinPath(extensionUri, 'web');
  
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
  
    // Listen for refresh message from the Webview
    panel.webview.onDidReceiveMessage(
      (message) => {
        if (message.command === 'refresh') {
          const refreshedSummaries = DashboardPanel.fetchLatestSummaries();
          panel.webview.html = DashboardPanel.getWebviewContent(refreshedSummaries);
        }
      },
      undefined,
      []
    );
  }
  private static fetchLatestSummaries(): string[] {
    const fs = require('fs');
    const path = require('path');
    const summariesDir = process.env.SUMMARY_PATH || path.join(__dirname, '..', '..', 'activity_repo', 'summaries');
  
    try {
      const files: string[] = fs.readdirSync(summariesDir).filter((f: string) => f.endsWith('.md'));
      return files.slice(-5).map(f => fs.readFileSync(path.join(summariesDir, f), 'utf8'));
    } catch (err) {
      console.error('Failed to load summaries:', err);
      return ['Failed to load summaries. Check path or file permissions.'];
    }
  }
  /**
   * Generates the HTML content for the webview.
   * @param summaries Array of summary strings.
   * @returns HTML string for the webview.
   */  

  private static getWebviewContent(summaries: string[]): string {
    const renderedSummaries = summaries.map((summary, i) => `
      <div class="summary-item">
        <div class="summary-header" onclick="toggleSummary(${i})">
          <strong>Summary #${i + 1}</strong>
          <button class="toggle-btn">Toggle</button>
        </div>
        <div class="summary-body" id="summary-${i}">
          <pre>${summary}</pre>
        </div>
      </div>
    `).join('\n');
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Productivity Dashboard</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 16px;
          }
          h1 {
            color: #007acc;
          }
          .controls {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          }
          .summary-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 10px;
            padding: 10px;
          }
          .summary-header {
            display: flex;
            justify-content: space-between;
            cursor: pointer;
          }
          .summary-body {
            display: block;
            padding-top: 10px;
          }
          .hidden {
            display: none;
          }
          input[type="text"] {
            flex: 1;
            padding: 6px;
            margin-right: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Productivity Dashboard</h1>
  
        <div class="controls">
          <input type="text" id="filterInput" placeholder="Filter summaries..." oninput="applyFilter()" />
          <button onclick="refresh()">🔄 Refresh</button>
        </div>
  
        <div id="summaryContainer">
          ${renderedSummaries}
        </div>
  
        <script>
          function toggleSummary(index) {
            const el = document.getElementById('summary-' + index);
            if (el.classList.contains('hidden')) {
              el.classList.remove('hidden');
            } else {
              el.classList.add('hidden');
            }
          }
  
          function applyFilter() {
            const query = document.getElementById('filterInput').value.toLowerCase();
            const summaries = document.querySelectorAll('.summary-item');
            summaries.forEach(item => {
              const text = item.innerText.toLowerCase();
              item.style.display = text.includes(query) ? '' : 'none';
            });
          }
  
          function refresh() {
            const vscode = acquireVsCodeApi();
            vscode.postMessage({ command: 'refresh' });
          }
        </script>
      </body>
      </html>
    `;
  }
}  