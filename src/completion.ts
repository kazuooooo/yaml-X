import {
  CompletionItem,
  MarkdownString,
  CompletionItemKind,
  window,
  workspace
} from 'vscode';
import { isEmpty, compact } from 'lodash';
import { excludeTopKey } from './helper';

export const buildCompletionFromYamlItems = (yamlItems: YamlItem[]) => compact(yamlItems.map((i) => {
  const config = workspace.getConfiguration("yaml-X");
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

    if (config.excludeTopKeyForCompletion) {
      completion.insertText = excludeTopKey(item.key);
    }

    return completion;

  } catch (err) {
    console.log(`Ooops, fail to parse item key: ${item.key}, value: ${item.value}, ${err.message}, now you have chance to contribute😆`);
    return null;
  }
}));