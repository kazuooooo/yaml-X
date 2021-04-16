
import {
  workspace,
  RelativePattern,
  window,
} from 'vscode';
import { Parser } from "./parser";
import { flattenDeep, compact } from 'lodash';

/**
 * Parse workspace yaml files and convert to YamlItems
 * @returns YamlItem[] Parsed yaml items
 */
export const loadYamlItems = async (): Promise<YamlItem[]> => {
  const config = workspace.getConfiguration("yaml-X");
  // Get WorkSpaceFolder
  const folder = workspace.workspaceFolders?.[0];
  if (!folder) { return []; }

  // List yml,yaml file uris in the folder
  const relativePath = new RelativePattern(folder, `${config.targetDir}/**/*.{yml,yaml}`);
  const uris = await workspace.findFiles(relativePath);

  if (uris.length === 0) {
    window.showWarningMessage(`No yml/yaml files found. Please check settings yaml-X.targetDir correctly.`);
  }

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