import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';

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

    // 🔁 Listen for messages from WebView
    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'refresh') {
          const refreshedSummaries = DashboardPanel.fetchLatestSummaries();
          panel.webview.html = DashboardPanel.getWebviewContent(refreshedSummaries);
        }

        if (message.command === 'aiInsights') {
          const latestSummaries = DashboardPanel.fetchLatestSummaries();
          const insight = await DashboardPanel.generateInsights(latestSummaries.join('\n\n'));
          panel.webview.postMessage({ command: 'insightResult', insight });
        }
      },
      undefined,
      []
    );
  }

  private static fetchLatestSummaries(): string[] {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    const fallback = path.resolve(__dirname, '../../../activity_repo/summaries');
    const summariesDir = process.env.SUMMARY_PATH || fallback;

    try {
      const files: string[] = fs.readdirSync(summariesDir).filter((f: string) => f.endsWith('.md'));
      return files.slice(-5).map(f => fs.readFileSync(path.join(summariesDir, f), 'utf8'));
    } catch (err) {
      console.error('Failed to load summaries:', err);
      return ['Failed to load summaries. Check path or file permissions.'];
    }
  }

  private static async generateInsights(content: string): Promise<string> {
    try {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return '🚫 OpenAI API key not found. Please set OPENAI_API_KEY in your environment.';
      }
  
      const openai = new OpenAI({ apiKey: openaiApiKey });
  
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a productivity insights assistant.' },
          { role: 'user', content: `Provide 3 high-level insights from these summaries:\n${content}` }
        ],
        max_tokens: 300
      });
  
      return response.choices[0]?.message?.content || 'No insights generated.';
    } catch (err: any) {
      console.error('Insight generation failed:', err);
      return '⚠️ Failed to generate insights. Check your OpenAI API key or internet connection.';
    }
  }

  private static getWebviewContent(summaries: string[]): string {
    const renderedSummaries = summaries.map((summary, i) => {
      const wordCount = summary.trim().split(/\s+/).length;
      const timestamp = `Last Commit: <em>Placeholder</em>`; // Hook later with git metadata
      return `
        <div class="summary-item">
          <div class="summary-header" onclick="toggleSummary(${i})">
            <strong>Summary #${i + 1}</strong>
            <button class="toggle-btn">Toggle</button>
          </div>
          <div class="summary-body" id="summary-${i}">
            <pre>${summary}</pre>
            <div class="meta">
              Word Count: ${wordCount}<br/>
              ${timestamp}
            </div>
          </div>
        </div>
      `;
    }).join('\n');

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
            gap: 10px;
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
          .meta {
            font-size: 0.9em;
            color: #555;
            margin-top: 8px;
          }
          .hidden {
            display: none;
          }
          #insightBox {
            border: 1px dashed #999;
            padding: 10px;
            margin-top: 15px;
            background: #f9f9f9;
          }
          input[type="text"] {
            flex: 1;
            padding: 6px;
          }
        </style>
      </head>
      <body>
        <h1>Productivity Dashboard</h1>
        <div class="controls">
          <input type="text" id="filterInput" placeholder="Filter summaries..." oninput="applyFilter()" />
          <button onclick="refresh()">🔄 Refresh</button>
          <button onclick="copyAll()">📋 Copy All</button>
          <button onclick="exportAll()">⬇️ Export</button>
          <button onclick="triggerInsights()">💡 AI Insights</button>
        </div>

        <div id="summaryContainer">
          ${renderedSummaries}
        </div>

        <div id="insightBox">
          <strong>AI Insights:</strong>
          <p id="insightText">Click 💡 to generate productivity insights from recent commits.</p>
        </div>

        <script>
          function toggleSummary(index) {
            const el = document.getElementById('summary-' + index);
            el.classList.toggle('hidden');
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

          function copyAll() {
            const summaries = Array.from(document.querySelectorAll('.summary-body pre'))
              .map(pre => pre.innerText)
              .join('\\n\\n---\\n\\n');
            navigator.clipboard.writeText(summaries).then(() => {
              alert('All summaries copied to clipboard!');
            });
          }

          function exportAll() {
            const summaries = Array.from(document.querySelectorAll('.summary-body pre'))
              .map(pre => pre.innerText)
              .join('\\n\\n---\\n\\n');
            const blob = new Blob([summaries], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'summaries_export.md';
            a.click();
            URL.revokeObjectURL(url);
          }

          function triggerInsights() {
            document.getElementById('insightText').textContent = 'Generating insights… please wait ⏳';
            const vscode = acquireVsCodeApi();
            vscode.postMessage({ command: 'aiInsights' });
          }

          window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'insightResult') {
              document.getElementById('insightText').textContent = message.insight;
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}
