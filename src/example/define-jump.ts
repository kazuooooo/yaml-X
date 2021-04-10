// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'javascript' }, {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
      const Location = new vscode.Location(vscode.Uri.file('/Users/matsumotokazuya/tmp/hoge.yml'), new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));
      return Location;
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() { }
