import * as vscode from 'vscode';
import { TrackerPanel } from './panel';

export function activate(context: vscode.ExtensionContext) {
  console.log('Productivity Tracker Extension active!');

  let disposable = vscode.commands.registerCommand('extension.startTracker', () => {
    TrackerPanel.createOrShow(context.extensionUri);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
console.log('✅ Extension activated and running');

