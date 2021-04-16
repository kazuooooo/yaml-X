import {
  Position,
  CancellationToken,
  TextDocument,
  Location,
  Range,
  Uri,
  window,
  workspace
} from 'vscode';
import { isUndefined } from 'lodash';
import { excludeTopKey, extractYamlKeyOfCurrentLine } from './helper';

export const findDefinition = (document: TextDocument, position: Position, token: CancellationToken, yamlItems: YamlItem[]) => {
  const config = workspace.getConfiguration("yaml-X");
  try {
    const yamlKey = extractYamlKeyOfCurrentLine(document, position);

    if (isUndefined(yamlKey)) {
      // yaml key not found in line
      return;
    }

    const selectWord = document.getText(document.getWordRangeAtPosition(position));
    if (!yamlKey?.includes(selectWord)) {
      // yaml key not select in cursor
      return;
    }

    const parentKey = yamlKey.split(selectWord)[0];
    let selectedKey = `${parentKey}${selectWord}`;

    // Find corresponding yaml item by yamlKey
    const item = yamlItems.find((item) => {
      const targetKey = config.excludeTopKeyForCompletion ? excludeTopKey(item.key) : item.key;
      return targetKey === selectedKey;
    });
    if (isUndefined(item)) {
      // TODO: QuickFix by inserting not found yaml key.
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
};