# **yaml-X README**
Boost your yaml experience 🚀
yaml-X is a vscode extension it can yaml Auto Completion & Definition Jump, 

If you are struggling find and input target yaml key from  project's innumerable yaml files, this extension should save you 💪

# **Features**

yaml-X indexes your workspace yaml(yml) files, then you can find the key and values from your editor.

## Auto Completion
Provides suggestions and completion when you input yaml keys.
\!\[Auto Completion\]\(./README_assets/movies/auto_completion.mov\)


## Definition Jump
Jump to a yaml key definition when you focus a yaml key.
\!\[Auto Completion\]\(./README_assets/movies/auto_completion.mov\)

### Support Exclude Locale yaml top key
If you use yaml for locale files, and want to exclude top locale keys(like en, ja).
You can exclude these keys by setting `excludeTopKey`
\!\[Auto Completion\]\(./README_assets/movies/support_locale.mov\)

**## Requirements**
First off, you need to turn on `editor.quickSuggestions.strings` to work Auto Completion in your `settings.json`

```json
...
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
...
```

Second, you need 2(and optionally 1) settings first.

[Reauired] **TargetDir**

Target yaml dir path which includes yaml(yml) files. 

Set relative path from project root dir.

⚠️Do not need ./⚠️

 e.g) src/locale

\!\[TargetDir\]\(./README_assets/images/target_dir.jpg\)


[Reauired] **yamlKeyArgFunction**

Function name which use yaml key as argument.

e.g) i18n.t

\!\[yamlKeyArgFunction\]\(./README_assets/images/function.jpg\)

yaml-X uses this function name as part of regex to find yaml keys like this.

```tsx
const regex = `.*${config.yamlKeyArgFunction}\\((\"|\'|\`)(?<yamlKey>.*)(\"|\'|\`)\\).*`;
```

(Optional) **excludeTopKey**
\!\[excludeTopKey\]\(./README_assets/images/exclude_top_key.jpg\)
It's useful setting if you input yaml key for translation without top language key(like ja, en)
By setting this value true, yaml-X suggest full key, but omit top key from input value.

<!-- **## FAQ** -->

**## Release Notes**
**### 1.0.0**

Initial release 🎉

Basic 2 features are relaased

- Autocompletion
- Defintion jump