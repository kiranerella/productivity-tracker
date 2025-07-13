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
  const summariesDir = process.env.SUMMARY_PATH || path.join(__dirname, '..', 'activity_repo', 'summaries');
  console.log('Reading summaries from:', summariesDir);

  try {
    if (!fs.existsSync(summariesDir)) {
      console.warn('Summaries directory not found');
      return [];
    }

    const files = fs.readdirSync(summariesDir).filter(f => f.endsWith('.md'));
    return files.slice(-5).map(f => fs.readFileSync(path.join(summariesDir, f), 'utf8'));
  } catch (err) {
    console.error('Failed to load summaries:', err);
    return [];
  }
}


