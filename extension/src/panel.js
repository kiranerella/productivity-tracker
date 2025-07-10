"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerPanel = void 0;
const vscode = __importStar(require("vscode"));
class TrackerPanel {
    constructor(panel, extensionUri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._update();
    }
    static createOrShow(extensionUri) {
        const column = vscode.ViewColumn.Beside;
        if (TrackerPanel.currentPanel) {
            TrackerPanel.currentPanel._panel.reveal(column);
        }
        else {
            const panel = vscode.window.createWebviewPanel('trackerPanel', 'Productivity Tracker', column, { enableScripts: true });
            TrackerPanel.currentPanel = new TrackerPanel(panel, extensionUri);
        }
    }
    _update() {
        this._panel.webview.html = this._getHtmlForWebview();
    }
    _getHtmlForWebview() {
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
exports.TrackerPanel = TrackerPanel;
