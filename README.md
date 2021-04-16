# **yaml-X README**

yaml-X is a vscode extension for boosting your yaml experience 🔥

If you are struggling find and input target yaml key from  project's innumerable yaml files, this extension should save you 💪

## **Features**

yaml-X indexes your workspace yaml(yml) files, then you can find the key and values from your editor.

### Auto Completion

Provides suggestions and completion when you input yaml keys.

[ここにgifを入れる](プロジェクト内の)

If you input yaml key without top locale key(like en, ja)

You can exclude top key by setting

### Definition Jump

Jump to a yaml key definition when you focus a yaml key.

[ここにgifを入れる]

### Check values without opening yaml files

Both Auto Completion and Definition Jump has a feature for checking values without opening yaml files.

[ここにgifを入れる]

**## Requirements**

To use this extension, you need 2(and optionally 1) settings first.

[Reauired] **TargetDir**

Target yaml dir path which includes yaml(yml) files. 

Set relative path from project root dir.

⚠️Do not need ./⚠️

 e.g) src/locale

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cd15c794-3f45-4dce-8a57-0fd096b2c34d/_Extension_Development_Host__-_Settings__tmp.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cd15c794-3f45-4dce-8a57-0fd096b2c34d/_Extension_Development_Host__-_Settings__tmp.jpg)

[Reauired] **yamlKeyArgFunction**

Function name which use yaml key as argument.

e.g) i18n.t

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f5419853-db55-49f5-9949-1a423172d827/_Extension_Development_Host__-_Settings__tmp.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f5419853-db55-49f5-9949-1a423172d827/_Extension_Development_Host__-_Settings__tmp.jpg)

yaml-X uses this function name as part of regex to find yaml keys like this.

```tsx
const regex = `.*${config.yamlKeyArgFunction}\\((\"|\'|\`)(?<yamlKey>.*)(\"|\'|\`)\\).*`;
```

(Optional) **excludeTopKeyForCompletion**

It's useful setting if you input yaml key for translation without top language key(like ja, en)

By setting this value true, yaml-X suggest full key, but omit top key from input value.

**## FAQ**

**## Release Notes**

**### 1.0.0**

Initial release 🎉

Basic 2 features are relaased

- Autocompletion
- Defintion jump