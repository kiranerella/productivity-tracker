console.log('✅ Extension file loaded');

import * as vscode from 'vscode';
import { DashboardPanel } from './panels/dashboard';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

// Ensure the data directory exists

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension activated');

  let trackerCmd = vscode.commands.registerCommand('extension.startTracker', () => {
    vscode.window.showInformationMessage('Tracker started!');
  });

  let dashboardCmd = vscode.commands.registerCommand('extension.showDashboard', () => {
    const summaries = getLatestSummaries();
    DashboardPanel.render(context.extensionUri, summaries);
  });
  

  context.subscriptions.push(trackerCmd, dashboardCmd);
}


function getLatestSummaries(): string[] {
  const defaultPath = path.resolve(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', 'activity_repo', 'summaries');
  const fallback = path.resolve(__dirname, '../../../activity_repo/summaries');
  const summariesDir = process.env.SUMMARY_PATH || defaultPath || fallback;

  try {
    console.log('📂 Loading from:', summariesDir);
    const files = fs.readdirSync(summariesDir).filter(f => f.endsWith('.md'));
    console.log('📄 Found summary files:', files);
    return files.map(f => fs.readFileSync(path.join(summariesDir, f), 'utf8'));
  } catch (err) {
    console.error('Failed to load summaries:', err);
    return ['⚠️ Could not read summaries directory.'];
  }
}



