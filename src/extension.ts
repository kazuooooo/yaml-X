import {
  ExtensionContext,
  Position,
  CancellationToken,
  TextDocument,
  languages,
  workspace,
  RelativePattern,
  CompletionItem,
  CompletionContext,
  MarkdownString,
  Location,
  Range,
  Uri,
  CompletionItemKind,
  window,
} from 'vscode';
import { Parser } from "./parser";
import { flattenDeep, isUndefined, isEmpty, compact } from 'lodash';
import { excludeTopKey } from './helper';

const config = workspace.getConfiguration("yaml-X");
export async function activate(context: ExtensionContext) {
  let yamlItems: YamlItem[] = await parseYamlFiles();
  const completions = compact(yamlItems.map((i) => {
    const item = i;
    try {
      // NOTE:
      // to work completion in string(e.g literal("xxx.yyy"))
      // Turn on setting editor.quickSuggestions: true
      // "editor.quickSuggestions": {
      //   ...
      //   "strings": true
      // }
      if (isEmpty(item.value) || isEmpty(item.key)) {
        return null;
      }

      const completion = new CompletionItem(item.key, CompletionItemKind.Text);
      completion.documentation = new MarkdownString(item.value!.toString());
      return completion;

    } catch (err) {
      window.showErrorMessage(`Ooops, fail to parse item key: ${item.key}, value: ${item.value}, ${err.message}, now you have chance to contribute😆`);
      return null;
    }
  }));

  // CompletionProvider
  const completionProvider = languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
      return completions;
    }
  });

  // Definition
  const definitionProvider = languages.registerDefinitionProvider({ scheme: 'file', language: 'javascript' }, {
    provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {

      try {
        // Read focused line
        const line = document.lineAt(position);

        // Try to extract yaml key with Regex
        // TODO: hanlde single quatation
        const yamlKeyArgFunctions = config.yamlKeyArgFunctions;
        const regex = `.*${yamlKeyArgFunctions[0]}\\(\"(?<yamlKey>.*)\"\\).*`;
        const result = line.text.match(regex);
        const yamlKey = result?.groups?.yamlKey;

        // No yaml key
        if (isUndefined(yamlKey)) {
          console.log("yamlKey not found", line.text);
          return;
        }

        // Not select yaml key
        const selectWord = document.getText(document.getWordRangeAtPosition(position));
        if (!yamlKey?.includes(selectWord)) {
          return;
        }
        const parentKey = yamlKey.split(selectWord)[0];
        const selectedKey = `${parentKey}${selectWord}`;

        // Find corresponding yaml item by yamlKey
        const item = yamlItems.find((item) => item.key === selectedKey);
        // TODO: Showing no yaml key
        if (isUndefined(item)) {
          console.log("item not found", yamlKey);
          return;
        }
        const range = new Range(new Position(item.lineNumber, 0), new Position(item.lineNumber, 0));
        const location = new Location(Uri.file(item.path), range);
        return location;
      } catch (err) {
        window.showErrorMessage(`Ooops, fail to provide definitions, now you have chance to contribute https://github.com/kazuooooo/yaml-x 😁`);
        console.error("err", err);
      }
    }

  });
  console.log("yaml-X: Loaded");
  context.subscriptions.push(completionProvider, definitionProvider);
}

// TODO: トップのenやjaを落とす対応を落とす対応
const parseYamlFiles = async (): Promise<YamlItem[]> => {
  // Get WorkSpaceFolder
  const folder = workspace.workspaceFolders?.[0];
  if (!folder) { return []; }

  // List yml,yaml file uris in the folder
  console.log("config", config);
  const relativePath = new RelativePattern(folder, `${config.targetDir}/**/*.{yml,yaml}`);
  const uris = await workspace.findFiles(relativePath);

  // Parse yaml files to YamlItems
  const items = await Promise.all(
    uris.map(async (uri) => {
      const rawData = await workspace.fs.readFile(uri);
      const stringData = Buffer.from(rawData).toString('utf8');
      const items = new Parser(uri.path).parse(stringData);
      return items;
    })
  );
  return compact(flattenDeep(items));
};

// this method is called when your extension is deactivated
export function deactivate() { }
