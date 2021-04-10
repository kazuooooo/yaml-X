import { Location, Uri, ExtensionContext, Position, CancellationToken, TextDocument, languages, Range } from 'vscode';
import { Parser } from "./parser";

export function activate(context: ExtensionContext) {
  // return Parser.parse();
  // languages.registerDefinitionProvider({ scheme: 'file', language: 'javascript' }, {
  //   provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
  //   }
  // });
}

// this method is called when your extension is deactivated
export function deactivate() { }
