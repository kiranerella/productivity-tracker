console.log('✅ Extension file loaded');

import * as vscode from 'vscode';
import { DashboardPanel } from './panels/dashboard';

// export function activate(context: vscode.ExtensionContext) {
//   console.log('✅ Extension activated');

//   let trackerCmd = vscode.commands.registerCommand('extension.startTracker', () => {
//     vscode.window.showInformationMessage('Tracker started!');
//     // start tracker logic
//   });

//   let dashboardCmd = vscode.commands.registerCommand('extension.showDashboard', () => {
//     DashboardPanel.render(context.extensionUri);
//   });

//   context.subscriptions.push(trackerCmd, dashboardCmd);
// }

// export function deactivate() {}

export function activate(context: vscode.ExtensionContext) {
  console.log('✅ Extension activated');

  let trackerCmd = vscode.commands.registerCommand('extension.startTracker', () => {
    vscode.window.showInformationMessage('Tracker started!');
  });

  let dashboardCmd = vscode.commands.registerCommand('extension.showDashboard', () => {
    DashboardPanel.render(context.extensionUri);
  });

  context.subscriptions.push(trackerCmd, dashboardCmd);
}

