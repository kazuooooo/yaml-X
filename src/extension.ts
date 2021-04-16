import {
  ExtensionContext,
  Position,
  CancellationToken,
  TextDocument,
  languages,
  workspace,
  CompletionContext,
} from 'vscode';
import { isUndefined, throttle } from 'lodash';
import { loadYamlItems } from './items-loader';
import { buildCompletionFromYamlItems } from './completion';
import { findDefinition } from './definition';
import { extractYamlKeyOfCurrentLine } from './helper';

export async function activate(context: ExtensionContext) {
  let yamlItems: YamlItem[] = await loadYamlItems();
  let completions = buildCompletionFromYamlItems(yamlItems);

  // Refresh yaml items on document changed
  const refresh = throttle(async (e) => {
    if (!e?.document.uri.path.match(/ya?ml$/)) { return; }
    yamlItems = await loadYamlItems();
    completions = buildCompletionFromYamlItems(yamlItems);
    console.log(`${yamlItems.length} items loaded`);
  }, 1000);
  workspace.onDidChangeTextDocument(refresh);

  // CompletionProvider
  const completionProvider = languages.registerCompletionItemProvider({ scheme: 'file', pattern: '**' }, {
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
      const isInputingYamlKey = !isUndefined(extractYamlKeyOfCurrentLine(document, position));
      if (isUndefined(isInputingYamlKey)) {
        // Not yaml key
        return;
      }
      return completions;
    }
  });

  // Definition
  const definitionProvider = languages.registerDefinitionProvider({ scheme: 'file', pattern: '**' }, {
    provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
      return findDefinition(document, position, token, yamlItems);
    }
  });

  console.log("yaml-X: Loaded");
  context.subscriptions.push(completionProvider, definitionProvider);
}

// this method is called when your extension is deactivated
export function deactivate() { }
