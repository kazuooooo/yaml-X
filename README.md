# yaml-X

![icon](https://user-images.githubusercontent.com/6919381/115827049-b9fd8e00-a446-11eb-970e-335a71e32404.png)

yaml-X is a vscode extension for boosting your yaml experience 🔥

If you are struggling to find and input target yaml key from your project's innumerable yaml files, this extension should save you 💪

# **Features**

yaml-X indexes your workspace yaml(yml) files, then you can find the key and values from your editor.

## Auto-Completion

Provides suggestions and completion when you input yaml keys.
![ezgif com-gif-maker](https://user-images.githubusercontent.com/6919381/115826696-43f92700-a446-11eb-9b2e-c1e940367017.gif)


## Definition Jump

Jump to a yaml key definition when you focus on a yaml key.
![definition_jump](https://user-images.githubusercontent.com/6919381/115826856-7c990080-a446-11eb-8c21-cf10d5e0e8a4.gif))


## Support locale yaml top key

If you use yaml for locale files and want to exclude top locale keys(like en, ja).
You can exclude these keys by setting `excludeTopKey`
![support_locale](https://user-images.githubusercontent.com/6919381/115827521-59bb1c00-a447-11eb-8374-0d4349afdbbc.gif)



# Requirements

First off, you need to turn on `editor.quickSuggestions.strings` to work Auto-Completion in your `settings.json`

```json
...
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
...
```

Second, you need 2(and optionally 1) settings.

## **Reauired: TargetDir**

Target yaml dir path which includes yaml(yml) files. 

Set relative path from project root dir.

⚠️Do not need ./⚠️

 e.g) src/locale

![target_dir](https://user-images.githubusercontent.com/6919381/115827592-78211780-a447-11eb-9286-046239dc93ba.jpg)



## **Reauired: yamlKeyArgFunction**

Function name which uses yaml key as an argument.

e.g) i18n.t

![function](https://user-images.githubusercontent.com/6919381/115827611-7eaf8f00-a447-11eb-87b7-eaf6a69bd237.jpg)


yaml-X uses this function name as part of regex to find yaml keys like this.

```tsx
const regex = `.*${config.yamlKeyArgFunction}\\((\"|\'|\`)(?<yamlKey>.*)(\"|\'|\`)\\).*`;
```



## Optional: excludeTopKey

![exclude_top_key](https://user-images.githubusercontent.com/6919381/115827633-8707ca00-a447-11eb-844d-85191ac07132.jpg)

It's a useful setting if you input yaml key for translation without top language key(like ja, en)
By setting this value true, yaml-X suggests full key but omits top key from the input value.

<!-- **## FAQ** -->

# Release Notes
## 1.0.0

Initial release 🎉

Basic 2 features are relaased

- Autocompletion
- Definition jump
