// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Start yml');

  const provider = vscode.languages.registerCompletionItemProvider('plaintext', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
      // 単純なCompletion("He"とか入れると補完してくれる)
      const simpleCompletion = new vscode.CompletionItem("Hello World");

      // スニペット付き
      const snippetCompletion = new vscode.CompletionItem('Good part of the day');
      // ↑を選ぶとmorning, afternoon, eveningの中から選択して入力できる。
      snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
      // 説明用のdocumentation
      snippetCompletion.documentation = new vscode.MarkdownString("Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.");

      // 特定のキーを押すと補完されるようにできるcompletion
      const commitCharacterCompletion = new vscode.CompletionItem('console');
      // .を押すとcon→consoleのように補完される
      commitCharacterCompletion.commitCharacters = ['.'];
      commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

      // コマンドが実行できるcompletion
      const commandCompletion = new vscode.CompletionItem('new');
      commandCompletion.kind = vscode.CompletionItemKind.Keyword;
      commandCompletion.insertText = 'new ';
      commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

      return [simpleCompletion, snippetCompletion, commitCharacterCompletion, commandCompletion];
    }
  });

  const provider2 = vscode.languages.registerCompletionItemProvider(
    'plaintext',
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

        // console.を打つまではreturnする
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('console.')) {
          return undefined;
        }

        // console.を打ったらcompletionItemを提示してあげる
        return [
          new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
        ];
      }
    },
    '.' // triggered whenever a '.' is being typed
  );
  context.subscriptions.push(provider, provider2);
}

// this method is called when your extension is deactivated
export function deactivate() { }
